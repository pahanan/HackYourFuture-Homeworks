const API_URL = 'https://raw.githubusercontent.com/pahanan/pahan_an.github.io/main/api/data.json';
const INGREDIENTS_API_URL = 'https://raw.githubusercontent.com/pahanan/pahan_an.github.io/main/api/ingredient-prices.json';
let recipes = [];
let ingredientPrices = {};

async function fetchRecipes() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Error!${response.status}`);
    }

    recipes = await response.json();
    console.log("Error!", recipes);
    await fetchIngredientPrices(); 
    enrichRecipesWithPrices(); 
    renderRecipes(recipes);
  } catch (error) {
    console.error('Error!', error);
  }
}

async function fetchIngredientPrices() {
  try {
    const response = await fetch(INGREDIENTS_API_URL);

    if (!response.ok) {
      throw new Error(`Error!  ${response.status}`);
    }

    ingredientPrices = await response.json();
  } catch (error) {
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

function renderRecipes(recipes) {
  const recipeForm = document.querySelector('#recipes-container');
  recipeForm.innerHTML = '';

  recipes.forEach((recipe) => {
    const newRecipeContainer = document.createElement('div');
    newRecipeContainer.classList.add('recipe-container');

    const recipeTitle = document.createElement('h1');
    recipeTitle.textContent = recipe.title;
    newRecipeContainer.appendChild(recipeTitle);

    const recipeImg = document.createElement('img');
    recipeImg.src = recipe.picture_url;
    recipeImg.alt = recipe.description;
    recipeImg.width = 400;
    newRecipeContainer.appendChild(recipeImg);

    if (recipe.ingredients && recipe.ingredients.length > 0) {
      const ingredientTitle = document.createElement('p');
      ingredientTitle.textContent = 'Ingredients:';
      newRecipeContainer.appendChild(ingredientTitle);

      const recipeIngredients = document.createElement('ul');
      recipe.ingredients.forEach((ingredient) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${ingredient.name}: ${ingredient.amount} (Price: ${ingredient.price} DKK)`;
        recipeIngredients.appendChild(listItem);
      });
      newRecipeContainer.appendChild(recipeIngredients);
    }

    const recipeDescription = document.createElement('p');
    recipeDescription.textContent = recipe.description;
    newRecipeContainer.appendChild(recipeDescription);

    recipeForm.appendChild(newRecipeContainer);
  });
}

function findRecipeByWord() {
  const wordForSearchInput = document.querySelector('#word-for-search').value.trim().toLowerCase();
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(wordForSearchInput)
  );
  renderRecipes(filteredRecipes);
}

let isSortedDescending = true;
function sortByAmountIngredients() {
  recipes.sort((a, b) =>
    isSortedDescending
      ? b.ingredients.length - a.ingredients.length
      : a.ingredients.length - b.ingredients.length
  );
  isSortedDescending = !isSortedDescending;
  renderRecipes(recipes);
}

let isFormExist = false;
function createRecipeForm() {
  if (isFormExist) {
    isFormExist = false;
    return;
  }
  isFormExist = true;
  const recipeForm = document.querySelector('#recipes-container');
  const newForm = document.createElement('div');

  createFormTitle(newForm);
  addNameAndImage(newForm);
  const ingredientsContainer = createIngredientsSection(newForm);
  createDescriptionField(newForm);
  createSubmitButton(newForm, ingredientsContainer);

  recipeForm.appendChild(newForm);
}

function createFormTitle(newForm) {
  const formTitle = document.createElement('h1');
  formTitle.textContent = 'New Recipe';
  newForm.appendChild(formTitle);
}

function addNameAndImage(newForm) {
  const formName = document.createElement('label');
  formName.textContent = 'Add name of dish';
  const nameInput = document.createElement('input');
  nameInput.id = 'recipe-title';
  formName.appendChild(nameInput);
  newForm.appendChild(formName);

  const formImg = document.createElement('label');
  formImg.textContent = 'Add image of dish';
  const imgInput = document.createElement('input');
  imgInput.id = 'recipe-image';
  formImg.appendChild(imgInput);
  newForm.appendChild(formImg);
}

function createIngredientsSection(newForm) {
  const labelIngredients = document.createElement('label');
  labelIngredients.textContent = 'Ingredients (min 5):';
  newForm.appendChild(labelIngredients);

  const ingredientsContainer = document.createElement('div');
  ingredientsContainer.id = 'ingredients-container';
  newForm.appendChild(ingredientsContainer);

  const addIngredientButton = document.createElement('button');
  addIngredientButton.type = 'button';
  addIngredientButton.textContent = 'Add ingredient';
  addIngredientButton.id = 'ingredient-button';

  addIngredientButton.addEventListener('click', () => {
    createFormForIngredient(ingredientsContainer);
  });

  newForm.appendChild(addIngredientButton);

  for (let i = 0; i < 5; i++) {
    createFormForIngredient(ingredientsContainer);
  }

  return ingredientsContainer;
}

function createFormForIngredient(ingredientsContainer) {
  const ingredientInput = document.createElement('div');
  ingredientInput.classList.add('ingredient');

  const nameInput = document.createElement('input');
  nameInput.classList.add('ingredient-name');
  nameInput.placeholder = 'Ingredient name';

  const amountInput = document.createElement('input');
  amountInput.classList.add('ingredient-amount');
  amountInput.placeholder = 'Amount';

  ingredientInput.appendChild(nameInput);
  ingredientInput.appendChild(amountInput);
  ingredientsContainer.appendChild(ingredientInput);
}

function createDescriptionField(newForm) {
  const formDescription = document.createElement('label');
  formDescription.textContent = 'Description:';
  const descriptionInput = document.createElement('textarea');
  descriptionInput.id = 'recipe-description';
  formDescription.appendChild(descriptionInput);
  newForm.appendChild(formDescription);
}

function createSubmitButton(newForm, ingredientsContainer) {
  const addRecipe = document.createElement('button');
  addRecipe.textContent = 'Add recipe';
  addRecipe.id = 'add-recipe-button';
  addRecipe.type = 'button';

  addRecipe.addEventListener('click', function (event) {
    event.preventDefault();

    const title = document.querySelector('#recipe-title').value.trim();
    const image = document.querySelector('#recipe-image').value.trim();
    const description = document.querySelector('#recipe-description').value.trim();

    if (!title || !image || !description) {
      alert('Please fill in all required fields: title, image URL, and description.');
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
      alert('Please fill in all ingredient fields.');
      return;
    }

    if (ingredients.length < 5) {
      alert('Please add at least 5 ingredients!');
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
    renderRecipes(recipes);
    newForm.innerHTML = '';
    addNewButton.style.display = 'block';
  });

  newForm.appendChild(addRecipe);
}

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

document.querySelector('#start-timer').addEventListener('click', startCustomTimer);

let isTimerRunning = false;
let timerInterval = null;

function startCustomTimer() {
  const timerInput = document.querySelector('#timer-input').value.trim();
  const timerDisplay = document.querySelector('#timer-display');
  const timeSound = document.querySelector('#alarm-sound');
  const finishSound = document.querySelector('#finish-sound');
  const startButton = document.querySelector('#start-timer');

  const minutes = parseInt(timerInput, 10);

  if (isNaN(minutes) || minutes <= 0) {
    alert('Please enter a valid time in minutes (greater than 0)');
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

  if (isTimerRunning) {
    stopTimer();
    return;
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
  timerInput.textContent = 0;
}

const addNewButton = document.querySelector('#add-new-recipe');
const sortButton = document.querySelector('#sort-button');
const searchButton = document.querySelector('#search-button');

if (addNewButton) addNewButton.addEventListener('click', createRecipeForm);
if (sortButton) sortButton.addEventListener('click', sortByAmountIngredients);
if (searchButton) searchButton.addEventListener('click', findRecipeByWord);

fetchRecipes();

const ingredientSearchButton = document.querySelector('#ingredient-search-button');
if (ingredientSearchButton) {
  ingredientSearchButton.addEventListener('click', findRecipeByIngredient);
}

function findRecipeByIngredient() {
  const ingredientForSearchInput = document.querySelector('#ingredient-for-search').value.trim().toLowerCase();
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.ingredients.some((ingredient) =>
      ingredient.name.toLowerCase().includes(ingredientForSearchInput)
    )
  );
  renderRecipes(filteredRecipes);
}

