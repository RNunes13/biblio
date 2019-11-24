
import BooksMain from '../../../../common/js/modules/Backoffice/Books';
import El from './__cache-selectors';

export default {
  init() {
    BooksMain.init();

    El.adminBooks.fileBtn.addEventListener('click', onClickFileBtn);
    El.adminBooks.fileRemove.addEventListener('click', onClickFileRemove);
    El.adminBooks.fileInput.addEventListener('change', onChangeFileInput);
  },
};

function onClickFileBtn(evt) {
  El.adminBooks.fileInput && El.adminBooks.fileInput.click();
}

function onClickFileRemove(evt) {
  Biblio.adminBookComponent.app.state.books.selected.newThumbnail = null;
  El.adminBooks.fileInput.value = "";
}

function onChangeFileInput(evt) {
  const files = evt.target.files;

  if (files && files[0]) {
    Biblio.adminBookComponent.app.state.books.selected.newThumbnail = {
      name: files[0].name,
      file: files[0],
    };
  }
}
