
import axios from 'axios';

export const booking = {
  async cancel(evt, scope) {
    evt.stopPropagation();

    const { id } = scope.booking;

    const confirmation = confirm(`A reserva ${id} será cancelada.`);

    if (confirmation) {
      try {
        await axios.put('/api/booking/cancel.php', { id });
  
        alertify.success('Reserva cancelada com sucesso.');
  
        setTimeout(() => window.location.reload(), 2000);
      } catch (err) {
        console.error(err);
        alertify.error('Ocorreu um erro ao tentar cancelar a reserva.');
      }
    }
  },

  async release(evt, scope) {
    evt.stopPropagation();

    const { id } = scope.booking;

    const confirmation = confirm(`A reserva ${id} será liberada.`);

    if (confirmation) {
      try {
        await axios.put('/api/booking/release.php', { id });
  
        alertify.success('Reserva liberada com sucesso.');
  
        setTimeout(() => window.location.reload(), 2000);
      } catch (err) {
        console.error(err);
        alertify.error('Ocorreu um erro ao tentar liberar a reserva.');
      }
    }
  }
};
