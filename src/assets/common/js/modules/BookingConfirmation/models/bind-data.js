
import axios from 'axios';
import qs from 'querystring';
import { data } from '../data/index';
import { controller } from '../controller/index';
import { bookingConfirmation as El } from '../../Globals/globals-selectors';

export default {
  init() {
    bindData();
  },
};

async function bindData() {
  const query = window.location.search.replace('?', '');
  const booking_id = qs.parse(query).booking_id;

  if (!booking_id) window.location.href = window.location.origin;

  let hasError = false;
  let booking = null;

  try {
    const resp = await axios.get(`/api/booking/read_one.php?id=${booking_id}`);

    booking = resp.data;
  } catch (err) {
    console.error(err);
    hasError = true;
    alertify.error('Ocorreu um erro na consulta da reserva, verifique se o ID está correto e tente novamente.', { delay: 50 });
  } finally {
    Biblio.bookingConfirmationComponent = Biblio.rivets.bind(El.bookingConfirmationComponent, {
      app: {
        props: data.props,
        state: {
          ...data.state,
          hasError,
          booking,
        },
        controller,
      },
    }).models;
  }
}
