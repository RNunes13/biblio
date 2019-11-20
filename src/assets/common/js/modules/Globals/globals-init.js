
import Zooming from 'zooming';

export default {
  init() {
    this.fontsLoad();
    this.setGlobals();
    this.setLazy();
    this.setAlertify();
    this.setZooming();
    this.closeMenus();
  },

  fontsLoad() {
    const Roboto300 = new FontFaceObserver('Roboto', {weight: 300});
    const Roboto400 = new FontFaceObserver('Roboto', {weight: 400});
    const Roboto700 = new FontFaceObserver('Roboto', {weight: 700});

    Promise.all([
      Roboto300.load(),
      Roboto400.load(),
      Roboto700.load(),
    ]);
  },

  setGlobals() {
    window.Biblio = window.Biblio || {};
    Biblio.pathname = window.location.pathname;

    // Cache Elements
    Biblio.html = document.querySelector('html');
    Biblio.body = document.querySelector('body');
    Biblio.header = document.querySelector('.js--header');
    Biblio.navbar = document.querySelector('.js--navbar');
    Biblio.footer = document.querySelector('.js--footer');
    Biblio.overlay = document.querySelector('.js--overlay');
    Biblio.backTop = document.querySelector('.js--back-top');
    Biblio.headerUser = document.querySelector('.js--header-user');
    Biblio.userMenu = document.querySelector('.js--header-user-menu');
    Biblio.rivets = window.rivets;

    // External Plugins
    Biblio.isMobile = isMobile.any;
  },

  setLazy() {
    Biblio.lazyload = new LazyLoad({
      data_src: 'src',
      data_srcset: 'srcset',
      class_loading: 'is--loading',
      class_loaded: 'is--loaded',
      class_error: 'has--lazy-error',
      elements_selector: '.js--lazy',
      threshold: 500,
      callback_reveal(el) {
        el.classList.remove('has--lazy');
      },
      callback_loaded(el) {
        el.classList.remove('has--placeloader');
      },
      callback_error(el) {
        const placeholder = el.getAttribute('placeholder');

        if (placeholder) {
          el.setAttribute('src', placeholder);
        } else {
          el.setAttribute('src', 'assets/images/book-placeholder.jpg');
        }

        el.classList.remove('has--placeloader');
      }
    });
  },

  setAlertify() {
    alertify.defaults = {
      notifier: {
        delay: 10,
        position: 'bottom-center',
      },
      glossary:{
        title: 'Alerta',
        ok: 'OK',
        cancel: 'Cancelar'            
      },
      theme: {
        input: 'ajs-input',
        ok: 'ajs-ok',
        cancel: 'ajs-cancel'
      },
      hooks: {
        preinit: function(instance) {},
        postinit: function(instance) {},
      },
    };
  },

  setZooming() {
    Biblio.zooming = new Zooming({
      bgColor: '#000000',
      bgOpacity: 0.9,
      scaleBase: Biblio.isMobile ? 0.9 : 0.8,
    }).listen('.img-zoomable')
  },

  closeMenus() {
    Biblio.closeMenus = (removeOverlay = false) => {
      if (removeOverlay) {
        Biblio.overlay.classList.remove('is--active');
        Biblio.body.classList.remove('has--no-scroll');
        Biblio.userMenu.classList.remove('is--open');
        Biblio.headerUser.classList.remove('menu-open');
      }
    };
  },
};
