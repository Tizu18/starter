import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import icons from 'url:../img/icons.svg';

import 'core-js/stable';
import 'regenerator-runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// Loading recipes from API
const controlRecipes = async function () {
  try {
    const recipeId = window.location.hash.slice(1);

    if (!recipeId) return;

    recipeView.renderSpinner();

    // 0) Update search results
    resultsView.update(model.getSearchResultsPage());

    // 1) Load recepie
    await model.loadRecipes(recipeId);

    // 2) Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
controlRecipes();

// Load recipes
const constrolSearchResults = async function () {
  try {
    const key = searchView.query();

    if (!key) return;

    resultsView.renderSpinner();

    // Load search recipes
    await model.loadShearchResults(key);

    // Render search recipes
    resultsView.render(model.getSearchResultsPage());

    // Render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    resultsView.renderError();
  }
};

const controlPagination = function (num) {
  // Render NEW results
  resultsView.render(model.getSearchResultsPage(num));

  // Render pagination
  paginationView.render(model.state.search);
};

const constrolServings = function (newServing) {
  // 1) Update servings
  model.updateServings(newServing);

  // 2) Render recipe
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/Remove bookmark
  if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  else model.addBookmark(model.state.recipe);

  // Update recepie view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render spinner
    addRecipeView.renderSpinner();

    // Upload new recipe data
    await model.addNewRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Succes message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID of URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(`${err.message}💥💥💥💥`);
  }
};

const init = function () {
  bookmarksView.addBookmarkHandler(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addUpdateServingsHandler(constrolServings);
  recipeView.addBookmarkHandler(controlAddBookmark);
  searchView.addSearchHandler(constrolSearchResults);
  paginationView.addEventClick(controlPagination);
  addRecipeView.addEvenetUpload(controlAddRecipe);
};
init();

// if (module.hot) {
//   module.hot.accept();
// }
