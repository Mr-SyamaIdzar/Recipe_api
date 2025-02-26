const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipe = document.getElementById("recipeContainer");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");

// Karena operasi fetch adalah operasi asinkron (membutuhkan waktu untuk mengambil data dari server), fungsi ini dideklarasikan sebagai async

// async digunakan untuk mendefinisikan fungsi asinkron.
// await digunakan untuk menunggu hasil dari operasi asinkron (seperti fetch atau Promise).
// Kombinasi async/await membuat kode asinkron lebih mudah dibaca, ditulis, dan di-debug.
const fetchRecipes = async (query) => {
  recipe.innerHTML = `<h2>Fetching Recipes...</h2>`;
  try {
    // menunggu sampai permintaan HTTP selesai dan mengembalikan respons dari server.
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    // menunggu sampai data JSON dari respons selesai di-parse.
    const response = await data.json();

    // Jika data berhasil diambil, elemen recipe dikosongkan dan data resep ditampilkan dalam bentuk card.
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

      // Setiap card resep memiliki tombol "View Recipe" yang, ketika diklik, akan memanggil fungsi openRecipePopup untuk menampilkan detail resep.
      const btn = document.createElement("button");
      btn.textContent = "View Recipe";
      recipeDiv.appendChild(btn);

      btn.addEventListener("click", () => {
        openRecipePopup(meal);
      });

      recipe.appendChild(recipeDiv);
    });
  } catch (error) {
    // Agar semua data tidak ditampilkan jika inputan kosong atau terjadi error
    recipe.innerHTML = "<h2>Error in Fetching Recipes...</h2>";
  }
};

// Fungsi ini bertugas untuk mengambil daftar bahan-bahan dari resep yang dipilih.
function fetchIngredients(meal) {
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
}

// Fungsi ini bertugas untuk menampilkan popup detail resep.
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

// Fungsi ini bertugas untuk menutup popup detail resep.
recipeCloseBtn.addEventListener("click", () => {
  recipeDetailsContent.parentElement.style.display = "none";
});

// Fungsi ini bertugas untuk memulai pencarian resep ketika tombol search diklik.
searchBtn.addEventListener("click", (e) => {
  e.preventDefault(); // Mencegah form dari pengiriman default yang mengakibatkan refresh halaman
  const searchValue = searchInput.value.trim();

  if (!searchValue) {
    recipe.innerHTML = `<h2>Type the meal in the search box</h2>`;
    return;
  }
  fetchRecipes(searchValue);
});
