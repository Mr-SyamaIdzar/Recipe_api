const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipe = document.getElementById("recipeContainer");

const fetchRecipes = async (query) => {
  recipe.innerHTML = `<h2>Fetching Recipes...</h2>`;
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
};

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchValue = searchInput.value.trim();
  fetchRecipes(searchValue);
});
