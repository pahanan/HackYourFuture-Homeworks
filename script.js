const recipes = [
  {
    id: 1,
    title: "Glögg",
    picture_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Gl%C3%B6gg_kastrull.JPG/800px-Gl%C3%B6gg_kastrull.JPG",
    ingredients: [
      { name: "Orange zest", amount: "0.5" },
      { name: "Water", amount: "200 ml" },
      { name: "Sugar", amount: "275 g" },
      { name: "Whole cloves", amount: "5" },
      { name: "Cinnamon sticks", amount: "2" },
    ],
    description: "Mix everything, heat it, and you are good to go!",
  },

  {
    id: 2,
    title: "Crab salad",
    picture_url:
      "https://img.iamcook.ru/2020/upl/recipes/cat/u-0e39647715eef84fcd286a52c4db259b.JPG",
    ingredients: [
      { name: "crab meat", amount: "1 pound" },
      { name: "2 ribs", amount: "celery" },
      { name: "mayonnaise", amount: "1 tablespoon" },
      { name: "lemon juice", amount: "5" },
      { name: "kosher salt", amount: "1/4 teaspoon" },
      { name: "finely diced shallot", amount: "2 tablespoons" },
      { name: "roughly chopped fresh herbs", amount: "1 tablespoon" },
    ],
    description: "Crab salad is one of the best ways to enjoy crab meat. It’s super easy to make and a meal you’ll love for the summer season. All you need are crab meat (I’ve got options), crisp vegetables, fresh herbs, and a creamy lemon dressing that ties it all together.",
  },

  {
    id: 3,
    title: "Borscht Recipe",
    picture_url:
      "https://vikalinka.com/wp-content/uploads/2019/01/Borscht-10-Edit-320x320.jpg",
    ingredients: [
      { name: "cold water", amount: "3 litres" },
      { name: "pork ribs or beef attached to a bone", amount: "600g" },
      { name: "onion", amount: "1/2" },
      { name: "carrot", amount: "1" },
      { name: "celery sticks", amount: "2" },
      { name: "bay leaves", amount: "2" },
      { name: "peppercorns", amount: "2" },
      { name: "salt", amount: "1 tsp" },    
    ],
    description: "Ukrainian borscht recipe. A rich meat based broth with beets, cabbage, potatoes and carrots served with a dollop of sour cream. ",
  },
];

const addNewButton = document.querySelector(`#add-new-recipe`);
addNewButton.addEventListener(`click`, createRecipeForm);

const sortButton = document.querySelector(`#sort-button`);
sortButton.addEventListener(`click`, sortByAmountIngredients);

const wordForSearchInput = document.querySelector(`#word-for-search`);
const searchButton = document.querySelector(`#search-button`);

searchButton.addEventListener("click", findRecipeByWord);

renderRecipes(recipes);

function renderRecipes(recipes) {
  const recipeForm = document.querySelector(`#recipes-container`);
  recipeForm.innerHTML = "";

  recipes.forEach((recipe) => {
    const newRecipeContainer = document.createElement("div");

    const recipeTitle = document.createElement("h1");
    recipeTitle.textContent = recipe.title;
    newRecipeContainer.appendChild(recipeTitle);

    const recipeImg = document.createElement("img");
    recipeImg.src = recipe.picture_url;
    recipeImg.alt = recipe.description;
    recipeImg.width = 400;
    newRecipeContainer.appendChild(recipeImg);

    if (recipe.ingredients && recipe.ingredients.length > 0) {
      const ingredientTitle = document.createElement("p");
      ingredientTitle.textContent = "Ingredients:";
      newRecipeContainer.appendChild(ingredientTitle);
      const lineBreak = document.createElement("br");
      newRecipeContainer.appendChild(lineBreak);

      const recipeIngredients = document.createElement("ul");
      recipe.ingredients.forEach((ingredient) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${ingredient.name}: ${ingredient.amount}`;
        recipeIngredients.appendChild(listItem);
      });
      newRecipeContainer.appendChild(recipeIngredients);
    }

    const recipeDescription = document.createElement("p");
    recipeDescription.textContent = recipe.description;
    newRecipeContainer.appendChild(recipeDescription);

    recipeForm.appendChild(newRecipeContainer);
  });
}

function createRecipeForm() {
  addNewButton.style.display = "none";
  const recipeForm = document.querySelector(`#recipes-container`);
  const newForm = document.createElement("div");

  createFormTitle(newForm);
  addNameAndImage(newForm);
  const ingredientsContainer = createIngredientsSection(newForm);
  createDescriptionField(newForm);
  createSubmitButton(newForm, ingredientsContainer);

  recipeForm.appendChild(newForm);
}

function createFormTitle(newForm) {
  const formTitle = document.createElement("h1");
  formTitle.textContent = "New Recipe";
  newForm.appendChild(formTitle);
}

function addNameAndImage(newForm) {
  const formName = document.createElement("label");
  formName.textContent = "Add name of dish";
  const nameInput = document.createElement("input");
  nameInput.id = "recipe-title";
  formName.appendChild(nameInput);
  newForm.appendChild(formName);

  const formImg = document.createElement("label");
  formImg.textContent = "Add image of dish";
  const imgInput = document.createElement("input");
  imgInput.id = "recipe-image";
  formImg.appendChild(imgInput);
  newForm.appendChild(formImg);
}

function createIngredientsSection(newForm) {
  const labelIngredients = document.createElement("label");
  labelIngredients.textContent = "Ingredients (min 5):";
  newForm.appendChild(labelIngredients);

  const ingredientsContainer = document.createElement("div");
  ingredientsContainer.id = "ingredients-container";
  newForm.appendChild(ingredientsContainer);

  const addIngredientButton = document.createElement("button");
  addIngredientButton.type = "button";
  addIngredientButton.textContent = "Add ingredient";
  addIngredientButton.id = "ingredient-button";

  addIngredientButton.addEventListener(`click`, () => {
    createFormForIngredient(ingredientsContainer);
  });

  newForm.appendChild(addIngredientButton);

  for (let i = 0; i < 5; i++) {
    createFormForIngredient(ingredientsContainer);
  }

  return ingredientsContainer;
}

function createFormForIngredient(ingredientsContainer) {
  const ingredientInput = document.createElement("div");
  ingredientInput.classList.add("ingredient");

  const nameInput = document.createElement("input");
  nameInput.classList.add("ingredient-name");
  nameInput.placeholder = "Ingredient name";

  const amountInput = document.createElement("input");
  amountInput.classList.add("ingredient-amount");
  amountInput.placeholder = "Amount";

  ingredientInput.appendChild(nameInput);
  ingredientInput.appendChild(amountInput);
  ingredientsContainer.appendChild(ingredientInput);
}

function createDescriptionField(newForm) {
  const formDescription = document.createElement("label");
  formDescription.textContent = "Description:";
  const descriptionInput = document.createElement("textarea");
  descriptionInput.id = "recipe-description";
  formDescription.appendChild(descriptionInput);
  newForm.appendChild(formDescription);
}

function createSubmitButton(newForm, ingredientsContainer) {
  const addRecipe = document.createElement("button");
  addRecipe.textContent = "Add recipe";
  addRecipe.id = "add-recipe-button";
  addRecipe.type = "button";

  addRecipe.addEventListener(`click`, function (event) {
    event.preventDefault();

    const title = document.querySelector("#recipe-title").value.trim();
    const image = document.querySelector("#recipe-image").value.trim();
    const description = document.querySelector("#recipe-description").value.trim();

    if (!title || !image || !description) {
      alert("Please fill in all required fields: title, image URL, and description.");
      return;
    }

    const ingredients = [];
    let hasEmptyIngredient = false;

    ingredientsContainer.querySelectorAll(".ingredient").forEach((ingredientInput) => {
      const name = ingredientInput.querySelector(".ingredient-name").value.trim();
      const amount = ingredientInput.querySelector(".ingredient-amount").value.trim();
      if (!name || !amount) {
        hasEmptyIngredient = true;
      } else {
        ingredients.push({ name, amount });
      }
    });

    if (hasEmptyIngredient) {
      alert("Please fill in all ingredient fields.");
      return;
    }

    if (ingredients.length < 5) {
      alert("Please add at least 5 ingredients!");
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
    renderRecipes(recipes);
    newForm.innerHTML = "";
    addNewButton.style.display = "block";
  });

  newForm.appendChild(addRecipe);
}

function findRecipeByWord(){
  const wordForSearchInput = document.querySelector(`#word-for-search`).value.trim().toLowerCase();
  const arrayRecipesWithWord = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(wordForSearchInput)
  );

  renderRecipes(arrayRecipesWithWord); 
}

let flag = true;
function sortByAmountIngredients(){
  if(flag){
    recipes.sort((a, b) => b.ingredients.length - a.ingredients.length);
    flag = false;

  } else{
    recipes.sort((a, b) => a.ingredients.length - b.ingredients.length);
    flag = true;
  }

  renderRecipes(recipes);
}


