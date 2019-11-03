
export default {
  init() {
    setTimeout(() => {
      this.closeOverlay();
    }, 150);
  },

  closeOverlay() {
    Biblio.overlay.addEventListener('click', (ev) => Biblio.closeMenus(true));
  },
};
