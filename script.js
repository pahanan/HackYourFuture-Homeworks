const API_URL = 'https://raw.githubusercontent.com/pahanan/pahan_an.github.io/main/api/data.json';
const INGREDIENTS_API_URL = 'https://raw.githubusercontent.com/pahanan/pahan_an.github.io/main/api/ingredient-prices.json';
let recipes = [];
let ingredientPrices = {};

const modal = document.querySelector('#modal');
const closeModalButton = document.querySelector('#close-modal');
const addNewRecipeButton = document.querySelector('#add-new-recipe');
const ingredientsContainer = document.querySelector('#ingredients-container');
const recipeForm = document.querySelector('#recipe-form');
const recipesContainer = document.querySelector('#recipes-container');
const searchInput = document.querySelector('#word-for-search');
const ingredientSearchInput = document.querySelector('#ingredient-for-search');
const searchButton = document.querySelector('#search-button');
const searchingredientButton = document.querySelector('#ingredient-search-button');


async function fetchRecipes() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Error! ${response.status}`);
    }

    recipes = await response.json();
    await fetchIngredientPrices();
    enrichRecipesWithPrices();
    renderRecipes();
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
}

async function fetchIngredientPrices() {
  try {
    const response = await fetch(INGREDIENTS_API_URL);
    if (!response.ok) {
      throw new Error(`Error! ${response.status}`);
    }
    ingredientPrices = await response.json();
  } catch (error) {
    console.error('Error fetching ingredient prices:', error);
  }
}

function enrichRecipesWithPrices() {
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const price = ingredientPrices[ingredient.name] || 'N/A';
      ingredient.price = price;
    });
  });
}

// Open modal window
addNewRecipeButton.addEventListener('click', () => {
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; 
  renderIngredientFields(5); 
});

closeModalButton.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
  ingredientsContainer.innerHTML = ''; 
  recipeForm.reset(); 
}

// A function for displaying multiple ingredient fields
function renderIngredientFields(count) {
  ingredientsContainer.innerHTML = ''; 
  for (let i = 0; i < count; i++) {
    addIngredientField(i + 1);
  }
}

// Function for adding an ingredient field
function addIngredientField(index) {
  const ingredientDiv = document.createElement('div');
  ingredientDiv.classList.add('ingredient');
  ingredientDiv.style.display = 'flex';
  ingredientDiv.style.gap = '10px';
  ingredientDiv.style.marginBottom = '10px';
  ingredientDiv.style.alignItems = 'center';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = `Ingredient ${index}`;
  nameInput.classList.add('ingredient-name');
  nameInput.style.flex = '1';

  const amountInput = document.createElement('input');
  amountInput.type = 'text';
  amountInput.placeholder = 'Amount';
  amountInput.classList.add('ingredient-amount');
  amountInput.style.flex = '1';

  ingredientDiv.appendChild(nameInput);
  ingredientDiv.appendChild(amountInput);
  ingredientsContainer.appendChild(ingredientDiv);
}

// Adding a new ingredient field when clicking on the button
const addIngredientButton = document.querySelector('#add-ingredient-button');
if (addIngredientButton) {
  addIngredientButton.addEventListener('click', () => {
    const currentCount = ingredientsContainer.querySelectorAll('.ingredient').length;
    addIngredientField(currentCount + 1);
  });
}

// Add new recipe
recipeForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.querySelector('#recipe-title').value.trim();
  const image = document.querySelector('#recipe-image').value.trim();
  const description = document.querySelector('#recipe-description').value.trim();

  if (!title || !image || !description) {
    alert('Please fill in all required fields.');
    return;
  }

  const ingredients = [];
  let hasEmptyIngredient = false;

  ingredientsContainer.querySelectorAll('.ingredient').forEach((ingredientInput) => {
    const name = ingredientInput.querySelector('.ingredient-name').value.trim();
    const amount = ingredientInput.querySelector('.ingredient-amount').value.trim();
    if (!name || !amount) {
      hasEmptyIngredient = true;
    } else {
      ingredients.push({ name, amount });
    }
  });

  if (hasEmptyIngredient) {
    alert('Please fill in all the ingredients fields.');
    return;
  }

  const newRecipe = {
    id: recipes.length + 1,
    title,
    picture_url: image,
    ingredients,
    description,
  };

  recipes.push(newRecipe);
  enrichRecipesWithPrices();
  renderRecipes();
  closeModal();
});

// Recipes render
function renderRecipes(recipesToRender = recipes) {
  recipesContainer.innerHTML = '';

  if (recipesToRender.length === 0) {
    recipesContainer.innerHTML = '<p>Recipes not found.</p>';
    return;
  }

  recipesToRender.forEach((recipe) => {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe-container');

    const recipeTitle = document.createElement('h1');
    recipeTitle.textContent = recipe.title;
    recipeDiv.appendChild(recipeTitle);

    const recipeImg = document.createElement('img');
    recipeImg.src = recipe.picture_url;
    recipeImg.alt = recipe.title;
    recipeImg.width = 300;
    recipeDiv.appendChild(recipeImg);

    const recipeDesc = document.createElement('p');
    recipeDesc.textContent = recipe.description;
    recipeDiv.appendChild(recipeDesc);

    const ingredientsList = document.createElement('ul');
    recipe.ingredients.forEach((ingredient) => {
      const ingredientItem = document.createElement('li');
      ingredientItem.textContent = `${ingredient.name}: ${ingredient.amount} (${ingredient.price} DKK)`;
      ingredientsList.appendChild(ingredientItem);
    });
    recipeDiv.appendChild(ingredientsList);

    recipesContainer.appendChild(recipeDiv);
  });
}

// Find Recipe By Word
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    findRecipeByWord();
  }
});

findRecipeByWord();
function findRecipeByWord() {
  
  searchButton.addEventListener('click', findRecipeByWord);

  const wordForSearchInput = searchInput.value.trim().toLowerCase();
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(wordForSearchInput)
  );
  
  ingredientSearchInput.value = '';
  renderRecipes(filteredRecipes);
}

// Find Ingredient By Word
ingredientSearchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    findRecipeByIngredient();
  }
});

findRecipeByIngredient();
function findRecipeByIngredient() {
  searchingredientButton.addEventListener(`click`, findRecipeByIngredient);

  const ingredientForSearchInput = ingredientSearchInput.value.trim().toLowerCase();
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.ingredients.some((ingredient) =>
      ingredient.name.toLowerCase().includes(ingredientForSearchInput)
    )
  );
  searchInput.value = '';
  renderRecipes(filteredRecipes);
}

function clearInputFields() {
  searchInput.value = '';
  ingredientSearchInput.value = '';
}

// sort By Amount of Ingredients
let isSortedDescending = true;
const sortButton = document.querySelector('#sort-button');
if (sortButton) {
  sortButton.addEventListener('click', sortByAmountIngredients);
}

function sortByAmountIngredients() {
  recipes.sort((a, b) =>
    isSortedDescending
      ? b.ingredients.length - a.ingredients.length
      : a.ingredients.length - b.ingredients.length
  );
  isSortedDescending = !isSortedDescending;
  clearInputFields();
  renderRecipes(recipes);
}

// Page-Timer
function startPageTimer() {
  const timerElement = document.querySelector('#page-timer');
  if (!timerElement) {
    console.error("Element with id '#page-timer' not found.");
    return;
  }

  let seconds = 0;

  function updateDisplay() {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    timerElement.textContent = `${hours}:${minutes}:${secs}`;
  }

  setInterval(() => {
    seconds++;
    updateDisplay();
  }, 1000);

  updateDisplay();
}

startPageTimer();

// Custom-Timer
let isTimerRunning = false;
let timerInterval = null;

function startCustomTimer() {
  const timerInput = document.querySelector('#timer-input').value.trim();
  const timerDisplay = document.querySelector('#timer-display');
  const timeSound = document.querySelector('#alarm-sound');
  const finishSound = document.querySelector('#finish-sound');
  const startButton = document.querySelector('#start-timer');

  const minutes = parseInt(timerInput, 10);

  if (isTimerRunning) {
    stopTimer();
    return;
  }

  if (isNaN(minutes) || minutes <= 0) {
    alert('Please enter a valid time in minutes (greater than 0)');
    return;
  }

  if(minutes > 600){
    alert('Please enter a valid time in minutes (less than 10 hours)');
    return;
  }

  let totalSeconds = minutes * 60;

  function updateDisplay() {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${hours}:${mins}:${secs}`;
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerDisplay.textContent = '00:00:00';
    finishSound.play();
    startButton.textContent = 'Start timer';
    isTimerRunning = false;
  }

  timerInterval = setInterval(() => {
    totalSeconds--;
    if (totalSeconds < 0) {
      stopTimer();
    } else {
      isTimerRunning = true;
      timeSound.play();
      updateDisplay();
    }
  }, 1000);

  isTimerRunning = true;
  startButton.textContent = 'Stop Timer';
  updateDisplay();
}

document.querySelector('#start-timer').addEventListener('click', startCustomTimer);

fetchRecipes();
