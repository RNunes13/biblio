
import axios from 'axios';
import { removeSpecialCharacters } from '../../../utils/remove-special-characters';

export const search = {
  submit(evt, scope) {
    evt.preventDefault();

    scope.app.state.form.isSubmiting = true;

    const title = scope.app.state.form.title.value;
    const author = scope.app.state.form.author.value;
    const genre = scope.app.state.form.genre.value;
    const publisher = scope.app.state.form.publisher.value;

    if (!title && !author && !genre && !publisher) {
      alertify.warning('Para fazer a busca é necessário informar ao menos um campo.');
      
      scope.app.state.form.isSubmiting = false;
      return;
    }

    const data = {
      publishing_company_id: publisher,
      author,
      title,
      genre,
    };

    axios.post('/api/books/search.php', data)
      .then(({ data }) => {
        scope.app.state.books.data = [];
        scope.app.state.books.data = data.records;
        scope.app.state.isSearching = true;
      })
      .catch((err) => {
        console.error(err);

        alertify.error("Ocorreu um erro na busca dos livros. Tente novamente em instantes.");
      })
      .finally(() => scope.app.state.form.isSubmiting = false);
  },

  clear(_, scope) {
    scope.app.state.form.title.value = '';
    scope.app.state.form.author.value = '';
    scope.app.state.form.genre.value = '';
    scope.app.state.form.publisher.value = '';
    
    scope.app.state.isSearching = false;
    scope.app.state.books.search = [];
    scope.app.state.books.data = [];
    scope.app.state.books.data = scope.app.state.books.raw.slice();
  },

  toggle(_, scope) {
    scope.app.state.showSearch = !scope.app.state.showSearch;
    scope.app.state.showSearchInfo = scope.app.state.showSearch ? 'Ocultar busca' : 'Buscar livros';
  },

  onChange(evt, scope) {
    const field = evt.target.name;
    const value = evt.target.value;
    const books = scope.app.state.books.raw;

    const filteredBooks = books.filter((book) => {
      if (field !== 'publisher') {
        const formattedField = removeSpecialCharacters((book[field] || "").toLocaleLowerCase());
        const formattedValue = removeSpecialCharacters(value.toLocaleLowerCase().trim());
        
        return formattedField.match(formattedValue);
      } else {
        return book.publisher.id == parseInt(value);
      }
    });

    scope.app.state.books.data = [];
    scope.app.state.books.data = filteredBooks;
    
    if (hasSearch(scope.app.state.form)) {
      scope.app.state.isSearching = true;
    } else {
      scope.app.state.isSearching = false;
      scope.app.state.books.data = [];
      scope.app.state.books.data = scope.app.state.books.raw.slice();
    }
  }
};

function hasSearch(formData) {
  const values = Object.values(formData).filter(value => typeof value === 'object');

  return values.some(v => v.value.length);
}
