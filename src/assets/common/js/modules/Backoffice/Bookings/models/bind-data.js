
import { data } from '../data/index';
import { admin_bookings as El } from '../../../Globals/globals-selectors';
import { getBookings } from '../methods';
import { controller } from '../controller/index';

export default {
  init() {
    bindData();
    loadBookings();
  },
};

async function bindData() {
  const user = JSON.parse(window.localStorage.getItem('@Biblio:user'));

  if (!user || (user && !['1', '3'].includes(user.role))) {
    window.location.href = window.location.origin;
    return;
  }

  Biblio.adminBookingComponent = Biblio.rivets.bind(El.adminBookingComponent, {
    app: {
      props: data.props,
      state: {
        ...data.state,
        user,
      },
      controller,
    },
  }).models;
}

function loadBookings() {
  getBookings()
  .then((resp) => {
    const bookings = resp.records
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
          reservation_date: new Date(d.reservation_date).toLocaleDateString(),
        }
      })
      .sort((a, b) => parseInt(a.id) > parseInt(b.id) ? 1 : parseInt(a.id) < parseInt(b.id) ? -1 : 0);

    Biblio.adminBookingComponent.app.state.bookings.raw = bookings.slice();
    Biblio.adminBookingComponent.app.state.bookings.data = bookings.slice();
  })
  .catch((err) => {
    console.error(err);
    alertify.error('Ocorreu um erro na consulta das reservas.');
  })
  .finally(() => Biblio.adminBookingComponent.app.state.bookings.isLoading = false);
}
