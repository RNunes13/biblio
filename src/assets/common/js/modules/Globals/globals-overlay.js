
export default {
  init() {
    setTimeout(() => {
      this.closeOverlay();
    }, 150);
  },

  closeOverlay() {
    Biblio.overlay && Biblio.overlay.addEventListener('click', (ev) => Biblio.closeMenus(true));
  },
};
