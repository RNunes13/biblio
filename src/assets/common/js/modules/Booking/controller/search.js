
import { removeSpecialCharacters } from '../../../utils/remove-special-characters';

export const search = {
  clear(_, scope) {
    scope.app.state.form.code = '';
    scope.app.state.form.book = '';
    scope.app.state.form.status = '';
    scope.app.state.form.date = '';
    
    scope.app.state.isFiltering = false;
    scope.app.state.bookings.data = [];
    scope.app.state.bookings.data = scope.app.state.bookings.raw.slice();
  },

  toggle(_, scope) {
    scope.app.state.showSearch = !scope.app.state.showSearch;
    scope.app.state.showSearchInfo = scope.app.state.showSearch ? 'Ocultar filtros' : 'Exibir filtros';
  },

  onChange(evt, scope) {
    const field = evt.target.name;
    const value = evt.target.value;
    const bookings = scope.app.state.bookings.raw;

    const filteredBookings = bookings.filter((booking) => {
      if (field !== 'date') {
        const formattedField = removeSpecialCharacters((booking[field] || "").toLocaleLowerCase());
        const formattedValue = removeSpecialCharacters(value.toLocaleLowerCase().trim());
        
        return formattedField.match(formattedValue);
      } else {
        if (!value) return;

        const timeFromValue = new Date(value).setUTCHours(3);
        const reservationDate = new Date(booking.reservation_date).toLocaleDateString();

        return timeFromValue === new Date(reservationDate).getTime();
      }
    });

    scope.app.state.bookings.data = [];
    scope.app.state.bookings.data = filteredBookings;
    
    scope.app.state.isFiltering = false;
  }
};
