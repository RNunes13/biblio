
export default {
  init() {
    this.fontsLoad();
    this.setGlobals();
    this.setLazy();
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
    Biblio.rivets = window.rivets;
    Biblio.firebase = window.firebase;

    // External Plugins
    Biblio.isMobile = isMobile.any;

    // Global variables
    Biblio.navbarHeight = 55; // pixels
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
      callback_set(_this) {
        document.querySelector(_this).clasList.remove('has--lazy');
      },
      callback_load(_this) {
        document.querySelector(_this).clasList.remove('has--placeloader');
      },
    });
  },
};
