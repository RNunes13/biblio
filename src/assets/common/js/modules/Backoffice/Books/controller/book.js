
import { admin_books as El } from '../../../Globals/globals-selectors';
import axios from 'axios';

export const book = {
  close(_, scope) {
    scope.app.state.showModal = false;
    scope.app.state.books.selected = null;

    El.bookModal.thumbnail.classList.remove('is--loaded');
    El.bookModal.thumbnail.classList.add('has--placeloader');
    El.bookModal.thumbnail.setAttribute('data-was-processed', 'false');
    El.bookModal.thumbnail.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
  },

  setBook(_, scope) {
    scope.app.state.books.selected = scope.book;
    scope.app.state.showModal = true;
    scope.app.state.modalTitle = "Editar livro";

    Biblio.lazyload.load(El.bookModal.thumbnail, true);
  },

  newBook(_, scope) {
    scope.app.state.books.selected = { _new: true, active: true };
    scope.app.state.showModal = true;
    scope.app.state.modalTitle = "Novo livro";
  },

  async save() {
    const { selected: book } = Biblio.adminBookComponent.app.state.books;
    const isNew = book._new;

    const data = {
      title: book.title,
      author: book.author,
      genre: book.genre,
      edition: book.edition,
      release_year: book.release_year,
      isbn: book.isbn,
      active: book.active,
      internal_identification: book.internal_identification,
      number_pages: book.number_pages,
      quantity: book.quantity,
      publishing_company_id: book.publisher.id || book.publisher,
    }

    try {
      if (isNew) {
        await axios.post('/api/books/create.php', data);
      } else {
        await axios.put('/api/books/update.php', { ...data, id: book.id });
      }

      alertify.success(`Livro ${isNew ? 'criado' : 'atualizado'} com sucesso.`);

      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      console.error(err);
      alertify.error(`Ocorreu um erro na ${isNew ? 'criação' : 'atualização'} do livro.`);
    }
  },

  async delete(evt, scope) {
    evt.stopPropagation();

    const { id } = scope.book;

    const confirmation = confirm(`O livro ${id} será deletado.`);

    if (confirmation) {
      try {
        await axios.delete(`/api/books/delete.php?id=${id}`);
  
        alertify.success('Livro deletado com sucesso.');
  
        setTimeout(() => window.location.reload(), 2000);
      } catch (err) {
        console.error(err);
        alertify.error('Ocorreu um erro ao tentar deletar o livro.');
      }
    }
  }
};
