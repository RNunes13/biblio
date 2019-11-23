
import { data } from '../data/index';
import { getBookings } from '../methods';
import { controller } from '../controller/index';
import { booking as El } from '../../Globals/globals-selectors';

export default {
  init() {
    bindData();
    loadBookings();
  },
};

async function bindData() {
  const user = JSON.parse(window.localStorage.getItem('@Biblio:user'));

  if (!user) {
    window.location.href = window.location.origin;
    return;
  }

  Biblio.bookingComponent = Biblio.rivets.bind(El.bookingComponent, {
    app: {
      props: data.props,
      state : {
        ...data.state,
        user,
      },
      controller,
    },
  }).models;
}

function loadBookings() {
  const { id } = Biblio.bookingComponent.app.state.user;

  getBookings(id)
  .then((data) => {
    const bookings = data
      .map((d) => {
        const formatStatus = () => {
          switch (d.status) {
            case 'waiting': return 'Aguardando';
            case 'canceled': return 'Cancelada';
            case 'completed': return 'Concluída';
            default: return d.status;
          }
        }

        return {
          ...d,
          status: formatStatus(),
          reservation_date: new Date(d.reservation_date).toLocaleString(),
        }
      })
      .sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0);

    Biblio.bookingComponent.app.state.bookings.raw = bookings.slice();
    Biblio.bookingComponent.app.state.bookings.data = bookings.slice();
  })
  .catch((err) => {
    console.error(err);
    alertify.error("Ocorreu um erro na consulta das reservas. Tente novamente em instantes.")
  })
  .finally(() => {
    Biblio.bookingComponent.app.state.bookings.isLoading = false
  });
}
