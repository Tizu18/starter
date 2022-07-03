import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  curPage;

  addEventClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    this.curPage = this._data.page;
    const pagesNum = Math.ceil(
      this._data.results.length / this._data.redultsPerPage
    );

    // 1 page and there are other pages
    if (this._data.page === 1 && pagesNum > 1)
      return `
        ${this._nextPage()}
        `;

    // Other page
    if (this._data.page > 1 && this._data.page < pagesNum)
      return `
        ${this._prevPage()}       
        ${this._nextPage()}
    `;

    // last page
    if (this._data.page === pagesNum) return this._prevPage();

    // 1 page and there's no other pages
    return 'one page';
  }

  _prevPage(num = 1) {
    return `
        <button data-goto="${
          this.curPage - num
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this.curPage - num}</span>
        </button>
    `;
  }
  _nextPage(num = 1) {
    return `
        <button data-goto="${
          this.curPage + num
        }" class="btn--inline pagination__btn--next">
            <span>Page ${this.curPage + num}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
  }
}
export default new PaginationView();
