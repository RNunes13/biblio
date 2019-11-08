
import smoothScroll from 'smoothscroll';

export default {
  init() {
    Biblio.backTop &&
    setTimeout(() => {
      this.showButton();
      this.onClick();
    }, 150);
  },

  showButton() {
    window.addEventListener('scroll', this.onScroll);
  },

  onScroll() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight - 55;

    if (scrollY > windowHeight) Biblio.backTop.classList.add('is--active');
    else Biblio.backTop.classList.remove('is--active');
  },

  onClick() {
    Biblio.backTop.addEventListener('click', (evt) => {
      evt.preventDefault();

      smoothScroll(0, 1000);
    });
  },
};
