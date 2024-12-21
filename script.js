let flag = true;
const recipes = [
  {
    id: 1,
    title: "Glögg",
    picture_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Gl%C3%B6gg_kastrull.JPG/800px-Gl%C3%B6gg_kastrull.JPG",
    ingredients: [
      { NAME: "Orange zest", AMOUNT: "0.5" },
      { NAME: "Water", AMOUNT: "200 ml" },
      { NAME: "Sugar", AMOUNT: "275 g" },
      { NAME: "Whole cloves", AMOUNT: "5" },
      { NAME: "Cinnamon sticks", AMOUNT: "2" },
    ],
    description: "Mix everything, heat it, and you are good to go!",
  },

  {
    id: 2,
    title: "Crab salad",
    picture_url:
      "https://img.iamcook.ru/2020/upl/recipes/cat/u-0e39647715eef84fcd286a52c4db259b.JPG",
    ingredients: [
      { NAME: "crab meat", AMOUNT: "1 pound" },
      { NAME: "2 ribs", AMOUNT: "celery" },
      { NAME: "mayonnaise", AMOUNT: "1 tablespoon" },
      { NAME: "lemon juice", AMOUNT: "5" },
      { NAME: "kosher salt", AMOUNT: "1/4 teaspoon" },
      { NAME: "finely diced shallot", AMOUNT: "2 tablespoons" },
      { NAME: "roughly chopped fresh herbs", AMOUNT: "1 tablespoon" },
    ],
    description: "Crab salad is one of the best ways to enjoy crab meat. It’s super easy to make and a meal you’ll love for the summer season. All you need are crab meat (I’ve got options), crisp vegetables, fresh herbs, and a creamy lemon dressing that ties it all together.",
  },

  {
    id: 3,
    title: "Borscht Recipe",
    picture_url:
      "https://vikalinka.com/wp-content/uploads/2019/01/Borscht-10-Edit-320x320.jpg",
    ingredients: [
      { NAME: "cold water", AMOUNT: "3 litres" },
      { NAME: "pork ribs or beef attached to a bone", AMOUNT: "600g" },
      { NAME: "onion", AMOUNT: "1/2" },
      { NAME: "carrot", AMOUNT: "1" },
      { NAME: "celery sticks", AMOUNT: "2" },
      { NAME: "bay leaves", AMOUNT: "2" },
      { NAME: "peppercorns", AMOUNT: "2" },
      { NAME: "salt", AMOUNT: "1 tsp" },    
    ],
    description: "Ukrainian borscht recipe. A rich meat based broth with beets, cabbage, potatoes and carrots served with a dollop of sour cream. ",
  },
];

const addNewButton = document.querySelector(`#add-new-recipe`);
addNewButton.addEventListener(`click`, addButtonforForm);

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
        listItem.textContent = `${ingredient.NAME}: ${ingredient.AMOUNT}`;
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

function addButtonforForm() {
  addNewButton.style.display = "none";
  const recipeForm = document.querySelector(`#recipes-container`);
  const newForm = document.createElement("div");

  const formTitle = document.createElement("h1");
  formTitle.textContent = "New recipe";
  newForm.appendChild(formTitle);

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

  const labelIngredients = document.createElement("label");
  labelIngredients.textContent = "Ingredients (min 5):";
  newForm.appendChild(labelIngredients);

  const ingredientsContainer = document.createElement("div");
  ingredientsContainer.id = "ingredients-container";
  newForm.appendChild(ingredientsContainer);

  const addIngredientButton = document.createElement("button");
  addIngredientButton.type = "button";
  addIngredientButton.textContent = "Add ingredient";
  addIngredientButton.id="ingredient-button";
  addIngredientButton.addEventListener(`click`, addFormForIngredient);

  newForm.appendChild(addIngredientButton);

  function addFormForIngredient() {
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

  for (let i = 0; i < 5; i++) {
    addFormForIngredient();
  }


  const formDescription = document.createElement("label");
  formDescription.textContent = "Description:";
  const descriptionInput = document.createElement("textarea");
  descriptionInput.id = "recipe-description";
  formDescription.appendChild(descriptionInput);
  newForm.appendChild(formDescription);

  const addRecipe = document.createElement("button");
  addRecipe.textContent = "Add recipe";
  addRecipe.id = "add-recipe-button";
  addRecipe.type = "button";

  addRecipe.addEventListener(`click`, function (event) {
    event.preventDefault();

    const title = nameInput.value.trim();
    const image = imgInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title || !image || !description) {
      alert("Please fill in all required fields: title, image URL, and description.");
      return;
    }

    const ingredients = [];
    let hasEmptyIngredient = false;

    document.querySelectorAll(".ingredient").forEach((ingredientInput) => {
      const name = ingredientInput.querySelector(".ingredient-name").value.trim();
      const amount = ingredientInput.querySelector(".ingredient-amount").value.trim();
      if (!name || !amount) {
        hasEmptyIngredient = true;
      } else {
        ingredients.push({ NAME: name, AMOUNT: amount });
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
  recipeForm.appendChild(newForm);
}

function findRecipeByWord(){
  const wordForSearchInput = document.querySelector(`#word-for-search`).value.trim().toLowerCase();
  const arrayRecipesWithWord = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(wordForSearchInput)
  );

  renderRecipes(arrayRecipesWithWord); 
}

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


