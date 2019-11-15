
import HomeMain from '../../../common/js/modules/Home/index';
import El from './__cache-seletors';

export default {
  init() {
    HomeMain.init();

    !Biblio.isMobile && El.home.searchShow.classList.add('is--hide');
  },
};
