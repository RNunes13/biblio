
import axios from "axios";

export const booking = {
  async cancel(_, scope) {
    const { id } = scope.booking;

    const confirmation = confirm(`A reserva ${id} será cancelada.`);

    if (confirmation) {
      try {
        await axios.put('/api/booking/cancel.php', { id });
  
        scope.booking.status = 'Cancelada';
        alertify.success("Assinatura cancelada com sucesso");
      } catch (err) {
        console.error(err);
        alertify.error("Ocorreu um erro no cancelamento da reserva.");
      }
    }
  },
};
