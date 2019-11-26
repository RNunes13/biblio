
import qs from 'querystring';
import axios from 'axios';

export default {
  async init() {
    const user = JSON.parse(window.localStorage.getItem('@Biblio:user'));
    const query = window.location.search.replace('?', '');
    const book_id = qs.parse(query).book_id;

    if (!user || !book_id) {
      window.location.href = window.location.origin;
      return;
    }

    try {
      const resp = await axios.post('/api/booking/reserve.php', { book_id, user_id: user.id });
      const { data } = resp;

      window.location.href = `${window.location.origin}/booking-confirmation.html?booking_id=${data.booking_id}`;
    } catch (err) {
      console.error(err);
      alertify.error('Ocorreu um erro ao tentar reservar o livro.');

      setTimeout(() => { window.location.href = window.location.origin }, 1500);
    }
  },
};
