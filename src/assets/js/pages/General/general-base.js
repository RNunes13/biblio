
import GenreralMain from '../../../common/js/modules/General';
import HeaderMain from './Header/header-methods';
import NavbarMain from './Navbar/navbar-methods';
import FooterMain from './Footer/footer-methods';

const NOT_INIT_GENERAL_MAIN = ['/login.html', '/register.html'];

export default {
  init() {
    !NOT_INIT_GENERAL_MAIN.includes(window.location.pathname) && GenreralMain.init();

    HeaderMain.init();
    NavbarMain.init();
    FooterMain.init();
  },
};
