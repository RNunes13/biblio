
export const confirmation = {
  print() {
    const printArea = document.querySelector('.js--print').innerHTML;

    const pagelink = 'about:blank';
    const pwa = window.open(pagelink, "_new");
          pwa.document.open();
          pwa.document.write(printArea);
          pwa.print();
          pwa.close();
  },
};
