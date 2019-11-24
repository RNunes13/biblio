
import axios from 'axios';

export const loan = {
  close(_, scope) {
    scope.app.state.showModal = false;
    scope.app.state.loans.selected = null;
  },

  setLoan(_, scope) {
    scope.app.state.loans.selected = scope.loan;
    scope.app.state.showModal = true;
    scope.app.state.modalTitle = "Editar empréstimo";
  },

  newLoan(_, scope) {
    scope.app.state.loans.selected = { _new: true };
    scope.app.state.showModal = true;
    scope.app.state.modalTitle = "Novo empréstimo";
  },

  async save() {
    const { selected: loan } = Biblio.adminLoanComponent.app.state.loans;
    const { id: user_id } = Biblio.adminLoanComponent.app.state.user;
    const isNew = loan._new;

    const data = {
      user_id: loan.user_id,
      book_id: loan.book_id,
    }

    try {
      if (isNew) {
        await axios.post('/api/book_loan/create.php', data);
      } else {
        await axios.put('/api/book_loan/update.php', { id: loan.id, book_id: loan.book_id, user_id });
      }

      alertify.success(`Empréstimo ${isNew ? 'criado' : 'atualizado'} com sucesso.`);

      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      console.error(err);
      alertify.error(`Ocorreu um erro na ${isNew ? 'criação' : 'atualização'} do empréstimo.`);
    }
  },

  async delete(evt, scope) {
    evt.stopPropagation();

    const { id } = scope.loan;

    const confirmation = confirm(`O empréstimo ${id} será finalizado.`);

    if (confirmation) {
      try {
        await axios.delete(`/api/book_loan/complete.php?id=${id}`);
  
        alertify.success('Empréstimo finalizado com sucesso.');
  
        setTimeout(() => window.location.reload(), 2000);
      } catch (err) {
        console.error(err);
        alertify.error('Ocorreu um erro ao tentar finalizar o empréstimo.');
      }
    }
  },

  async renew(evt, scope) {
    evt.stopPropagation();

    const { id } = scope.loan;

    const confirmation = confirm(`O empréstimo ${id} será renovado.`);

    if (confirmation) {
      try {
        await axios.put('/api/book_loan/renew.php', { id });
  
        alertify.success('Empréstimo renovado com sucesso.');
  
        setTimeout(() => window.location.reload(), 2000);
      } catch (err) {
        console.error(err);
        alertify.error('Ocorreu um erro ao tentar renovar o empréstimo.');
      }
    }
  }
};
