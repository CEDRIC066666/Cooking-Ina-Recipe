const searchForm = document.querySelector('form');
const searchInput = document.querySelector('#search');
const resultsList = document.querySelector('#results');
const randomRecipesContainer = document.querySelector('#random-recipes');

document.addEventListener('DOMContentLoaded', getRandomRecipes);

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchRecipes();
})

async function searchRecipes() {
    const searchValue = searchInput.value.trim();
    if (searchValue) {
        const response = await fetch(`https://api.edamam.com/search?q=${searchValue}&app_id=c852a4dd&app_key=01c59f69269c60a4ce314f1bc764a362&from=0&to=10`);
        const data = await response.json();
        displayRecipes(data.hits);
        randomRecipesContainer.style.display = 'none';
    }
}

function displayRecipes(recipes) {
    let html = '';
    recipes.forEach((recipe) => {
        html += `
        <div>
            <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
            <h3>${recipe.recipe.label}</h3>
            <ul>
                ${recipe.recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <a href="${recipe.recipe.url}" target="_blank">View Recipe</a>
        </div> 
        `
    })
    resultsList.innerHTML = html;

    const viewRecipeButtons = document.querySelectorAll('#results a');
    viewRecipeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const recipeIndex = Array.from(viewRecipeButtons).indexOf(button);
            openModal(recipes[recipeIndex].recipe);
        });
    });
}

async function getRandomRecipes() {
    const response = await fetch(`https://api.edamam.com/search?q=random&app_id=c852a4dd&app_key=01c59f69269c60a4ce314f1bc764a362&from=0&to=50`);
    const data = await response.json();
    const recipes = data.hits.map(hit => hit.recipe);

    const shuffledRecipes = recipes.sort(() => 0.5 - Math.random());

    const randomRecipes = shuffledRecipes.slice(0, 8);
    displayRandomRecipes(randomRecipes);
}

function displayRandomRecipes(recipes) {
    let html = '';
    recipes.forEach((recipe) => {
        html += `
        <div>
            <img src="${recipe.image}" alt="${recipe.label}">
            <h3>${recipe.label}</h3>
            <ul>
                ${recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <a href="${recipe.url}" target="_blank">View Recipe</a>
        </div> 
        `
    })
    randomRecipesContainer.innerHTML = html;
}

function openModal(recipe) {
    const modal = document.getElementById("recipe-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalIngredients = document.getElementById("modal-ingredients");
    const modalLink = document.getElementById("modal-link");

    modalTitle.textContent = recipe.label;
    modalIngredients.innerHTML = recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('');
    modalLink.href = recipe.url;

    modal.style.display = "block";
}

const closeModal = document.querySelector('.close');
closeModal.onclick = function() {
    const modal = document.getElementById("recipe-modal");
    modal.style.display = "none";
}

// Close the modal when the user clicks anywhere outside of it
window.onclick = function(event) {
    const modal = document.getElementById("recipe-modal");
    if (event.target == modal) {
    modal.style.display = "none";
    }
}