
import { home as El } from '../../Globals/globals-selectors';

export const modal = {
  close(_, scope) {
    scope.app.state.showModal = false;
    scope.app.state.books.selected = {};

    El.bookModal.thumbnail.classList.remove('is--loaded');
    El.bookModal.thumbnail.classList.add('has--placeloader');
    El.bookModal.thumbnail.setAttribute('data-was-processed', 'false');
    El.bookModal.thumbnail.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
  },

  setBook(_, scope) {
    scope.app.state.books.selected = scope.book;
    scope.app.state.showModal = true;

    Biblio.lazyload.update([El.bookModal.thumbnail]);
  }
};
