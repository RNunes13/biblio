
import { home as El } from '../../Globals/globals-selectors';
import { checkUser } from '../../../utils/check-user';
import axios from 'axios';

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

    Biblio.lazyload.load(El.bookModal.thumbnail, true);
  },

  async reserve(_, scope) {
    const book_id = scope.app.state.books.selected.id;
    const user = checkUser(`/reserve.html?book_id=${book_id}`);

    if (!user) return;

    try {
      const resp = await axios.post('/api/booking/reserve.php', { book_id, user_id: user.id });
      const { data } = resp;

      window.location.href = `${window.location.origin}/booking-confirmation.html?booking_id=${data.booking_id}`;
    } catch (err) {
      console.error(err);
      alertify.error('Ocorreu um erro ao tentar reservar o livro. Tente novamente em instantes.');
    }
  }
};
