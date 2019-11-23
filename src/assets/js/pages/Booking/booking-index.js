
import El from './__cache-seletors';
import BookingMain from '../../../common/js/modules/Booking';

export default {
  init() {
    BookingMain.init();

    !Biblio.isMobile && El.booking.filtersShow.classList.add('is--hide');
  },
};
