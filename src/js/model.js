// import { indexOf } from 'core-js/core/array';
import { async } from '../../node_modules/regenerator-runtime';
import { API_URL, KEY } from './config.js';
import { RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    redultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  let { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    image: recipe.image_url,
    servings: recipe.servings,
    source: recipe.source_url,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

// Load recipes
export const loadRecipes = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // Temp error handling
    console.error(`${err}💥💥💥💥`);
    throw err;
  }
};

export const loadShearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        image: recipe.image_url,
        publisher: recipe.publisher,
        id: recipe.id,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.redultsPerPage; // 0
  const end = page * state.search.redultsPerPage; // 9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    const calcServing = (ing.quantity * newServings) / state.recipe.servings;

    ing.quantity = Math.round(calcServing * 100.0) / 100.0;
  });

  state.recipe.servings = newServings;
};

// Math.round(ing.quantity * 100.0) / 100.0

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (bookmark) {
  // Add bookmark
  state.bookmarks.push(bookmark);

  // Mark current recipe as bookmarked
  if (bookmark.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);

  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storedData = localStorage.getItem('bookmarks');
  if (storedData) state.bookmarks = JSON.parse(storedData);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const addNewRecipe = async function (newRecipe) {
  try {
    console.log(Object.entries(newRecipe));

    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format. Please use the correct format!'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      publisher: newRecipe.publisher,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);

    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
