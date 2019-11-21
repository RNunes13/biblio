
import { header as El } from '../../../../common/js/modules/Globals/globals-selectors';

export default {
  init() {
    this.showMenu();
  },

  showMenu() {
    El.userInfo && El.userInfo.addEventListener('click', (evt) => {
      Biblio.userMenu.classList.toggle('is--open');
      Biblio.headerUser.classList.toggle('menu-open');
      Biblio.overlay.classList.toggle('is--active');
      Biblio.body.classList.toggle('has--no-scroll');
    });
  }
};
