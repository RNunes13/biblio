
import { data } from '../data/index';
import { admin_books as El } from '../../../Globals/globals-selectors';
import { getBooks, getPublishers } from '../methods';
import { controller } from '../controller/index';

export default {
  init() {
    bindData();
  },
};

async function bindData() {
  const user = JSON.parse(window.localStorage.getItem('@Biblio:user'));

  if (!user || (user && user.role !== '1')) {
    window.location.href = window.location.origin;
    return;
  }

  let publishers = [];
  
  try {
    const data = await getPublishers();
    publishers = data.records;
  } catch(err) {
    console.error(`Error fetching publishers -> ${err}`);
  }

  Biblio.adminBookComponent = Biblio.rivets.bind(El.adminBookComponent, {
    app: {
      state: {
        ...data.state,
        user,
      },
      props: {
        ...data.props,
        publishers,
      },
      controller,
    },
  }).models;

  loadBooks();
}

function loadBooks() {
  getBooks()
  .then((resp) => {
    const books = resp.records.sort((a, b) =>
      parseInt(a.id) > parseInt(b.id) ? 1 : parseInt(a.id) < parseInt(b.id) ? -1 : 0
    );

    Biblio.adminBookComponent.app.state.books.raw = books.slice();
    Biblio.adminBookComponent.app.state.books.data = books.slice();
  })
  .catch((err) => {
    console.error(err);
    alertify.error('Ocorreu um erro na consulta dos livros.');
  })
  .finally(() => Biblio.adminBookComponent.app.state.books.isLoading = false);
}
