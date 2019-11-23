
import El from './__cache-seletors';
import LoanMain from '../../../common/js/modules/Loan';

export default {
  init() {
    LoanMain.init();

    !Biblio.isMobile && El.loan.filtersShow.classList.add('is--hide');
  },
};
