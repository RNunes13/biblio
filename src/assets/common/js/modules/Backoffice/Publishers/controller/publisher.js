
import axios from 'axios';

export const publisher = {
  close(_, scope) {
    scope.app.state.showModal = false;
    scope.app.state.publishers.selected = null;
  },

  setPublisher(_, scope) {
    scope.app.state.publishers.selected = scope.publisher;
    scope.app.state.showModal = true;
    scope.app.state.modalTitle = "Editar editora";
  },

  newPublisher(_, scope) {
    scope.app.state.publishers.selected = { _new: true };
    scope.app.state.showModal = true;
    scope.app.state.modalTitle = "Nova editora";
  },

  async save() {
    const { selected: publisher } = Biblio.adminPublishersComponent.app.state.publishers;
    const isNew = publisher._new;

    const data = {
      name: publisher.name,
    }

    try {
      if (isNew) {
        await axios.post('/api/publisher/create.php', data);
      } else {
        await axios.put('/api/publisher/update.php', { ...data, id: publisher.id });
      }

      alertify.success(`Editora ${isNew ? 'criada' : 'atualizada'} com sucesso.`);

      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      console.error(err);
      alertify.error(`Ocorreu um erro na ${isNew ? 'criação' : 'atualização'} da editora.`);
    }
  },

  async delete(evt, scope) {
    evt.stopPropagation();

    const { id } = scope.publisher;

    const confirmation = confirm(`A editora ${id} será deletada. Se houver algum livro cadastrado nessa editora, ela não será deletada.`);

    if (confirmation) {
      try {
        await axios.delete(`/api/publisher/delete.php?id=${id}`);
  
        alertify.success('Editora deletada com sucesso.');
  
        setTimeout(() => window.location.reload(), 2000);
      } catch (err) {
        console.error(err);
        alertify.error('Ocorreu um erro ao tentar deletar a editora, tenha certeza que não há livros com essa editora.');
      }
    }
  }
};
