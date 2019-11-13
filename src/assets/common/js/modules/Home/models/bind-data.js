
import { data } from '../data/index';
import { home as El } from '../../Globals/globals-selectors';
import { getBooks, getPublishers } from '../methods';
import { controller } from '../controller/index';

export default {
  init() {
    bindData();
  },
};

async function bindData() {
  let publishers = [];
  
  try {
    const data = await getPublishers();
  
    publishers = data.records;
  } catch(err) {
    console.error(`Error fetching publishers -> ${err}`);
  }

  Biblio.homeComponent = Biblio.rivets.bind(El.homeComponent, {
    app: {
      state: data.state,
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
  setTimeout(() => {
    getBooks()
    .then((resp) => {
      Biblio.homeComponent.app.state.books.data = resp.records;
    })
    .catch((err) => {
      console.error(err);
      alertify.error('Ocorreu um erro na consulta dos livros.');
    })
    .finally(() => Biblio.homeComponent.app.state.books.isLoading = false);
  }, 2000);
}
