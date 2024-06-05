const conn = new WebSocket('ws://localhost:8000');
const chats = document.getElementById("chats");

let user;

conn.addEventListener('open', () => {
    console.log('Connected to the WebSocket server');
});

conn.addEventListener('message', (message) => {
    const item = document.createElement("li");
    item.appendChild(document.createTextNode(message.data));
    chats.appendChild(item);
    chats.scrollTop = chats.scrollHeight; // Scroll to the bottom
});

function getName() {
    user = document.getElementById("nameField").value;
    const nameDiv = document.getElementById("nameDiv");
    const chatDiv = document.getElementById("chatDiv");

    nameDiv.style.display = "none";
    chatDiv.style.display = "block";

    document.getElementById("greet").innerHTML = `Hello ${user}!`;
}

function sendMessage() {
    let data = document.getElementById("messageField").value;

    if (data.trim() !== "") {
        const message = JSON.stringify({
            user: user,
            message: data
        });
        conn.send(message);
        document.getElementById("messageField").value = "";
    }
}

document.getElementById("messageField").addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});
