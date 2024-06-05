const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const ws_server = new WebSocket.Server({ server });

let messages = [];

ws_server.on('connection', (conn) => {
    messages.forEach((message) => {
        conn.send(message);
    });

    conn.on('message', (message) => {
        const received = JSON.parse(message);
        const reply = `${received.user}: ${received.message}`;
        messages.push(reply);
        ws_server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(reply);
            }
        });
    });

    conn.on('close', () => {
        ws_server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`A user has disconnected.`);
            }
        });
    });
});

server.listen(8000, () => {
    console.log('Server is listening on port 8000');
});
