
import axios from 'axios';

export const search = {
  submit(evt, scope) {
    evt.preventDefault();

    scope.app.state.form.isSubmiting = true;

    const book = scope.app.state.form.book.value;
    const author = scope.app.state.form.author.value;
    const genre = scope.app.state.form.genre.value;
    const publisher = scope.app.state.form.publisher.value;

    console.log("Data -> ", book, author, genre, publisher);

    scope.app.state.form.isSubmiting = false;
  },

  clear(_, scope) {
    scope.app.state.form.book.value = '';
    scope.app.state.form.author.value = '';
    scope.app.state.form.genre.value = '';
    scope.app.state.form.publisher.value = '';
  },
};
