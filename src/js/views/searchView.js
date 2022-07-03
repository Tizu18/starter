import icons from 'url:../../img/icons.svg';

class SearchView {
  _searchForm = document.querySelector('.search');

  query() {
    return document.querySelector('.search__field').value;
  }

  addSearchHandler(handler) {
    this._searchForm.addEventListener('submit', function (e) {
      e.preventDefault();

      handler();
    });
  }
}

export default new SearchView();
