const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipe = document.getElementById("recipeContainer");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");

const fetchRecipes = async (query) => {
  recipe.innerHTML = `<h2>Fetching Recipes...</h2>`;
  try {
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const response = await data.json();

    recipe.innerHTML = "";
    response.meals.forEach((meal) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");
      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea}</span> Dish</p>
        <p>Belongs to <span>${meal.strCategory}</span> Category</p>
      `;

      const btn = document.createElement("button");
      btn.textContent = "View Recipe";
      recipeDiv.appendChild(btn);

      btn.addEventListener("click", () => {
        openRecipePopup(meal);
      });

      recipe.appendChild(recipeDiv);
    });
  } catch (error) {
    recipe.innerHTML = "<h2>Error in Fetching Recipes...</h2>";
  }
};

const fetchIngredients = (meal) => {
  let ingredients = "";
  console.log(meal);
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredients += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredients;
};

const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
    <div class="recipeInstructions">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
  `;

  recipeDetailsContent.parentElement.style.display = "block";
};

recipeCloseBtn.addEventListener("click", () => {
  recipeDetailsContent.parentElement.style.display = "none";
});

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchValue = searchInput.value.trim();

  if (!searchValue) {
    recipe.innerHTML = `<h2>Type the meal in the search box</h2>`;
    return;
  }
  fetchRecipes(searchValue);
});
