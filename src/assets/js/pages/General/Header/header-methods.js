
import { header as El } from '../../../../common/js/modules/Globals/globals-selectors';

export default {
  init() {
    this.showMenu();
    this.showNav();
  },

  showMenu() {
    El.userInfo && El.userInfo.addEventListener('click', () => {
      Biblio.userMenu.classList.toggle('is--open');
      Biblio.headerUser.classList.toggle('menu-open');
      Biblio.overlay.classList.toggle('is--active');
      Biblio.body.classList.toggle('has--no-scroll');
    });
  },

  showNav() {
    Biblio.menuBtn && Biblio.menuBtn.addEventListener('click', () => {
      Biblio.navbar.classList.toggle('is--active');
      Biblio.overlay.classList.toggle('is--active');
      Biblio.body.classList.toggle('has--no-scroll');
      Biblio.menuBtn.classList.toggle('nav-open');
    });
  }
};
