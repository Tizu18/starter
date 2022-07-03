import View from './View';
import icons from 'url:../../img/icons.svg';

class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _recipeWindow = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _message = 'Recipe was successfully uploaded!';

  _openWindow = document.querySelector('.nav__btn--add-recipe');
  _closeWindow = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addEventToggleWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._recipeWindow.classList.toggle('hidden');
  }

  _addEventToggleWindow() {
    this._openWindow.addEventListener('click', this.toggleWindow.bind(this));
    // Close window
    this._closeWindow.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addEvenetUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new addRecipeView();
