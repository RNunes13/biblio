
import { data } from '../data/index';
import { getLoans } from '../methods';
import { controller } from '../controller/index';
import { loan as El } from '../../Globals/globals-selectors';

export default {
  init() {
    bindData();
    loadLoans();
  },
};

async function bindData() {
  const user = JSON.parse(window.localStorage.getItem('@Biblio:user'));

  if (!user) {
    window.location.href = window.location.origin;
    return;
  }

  Biblio.loanComponent = Biblio.rivets.bind(El.loanComponent, {
    app: {
      props: data.props,
      state : {
        ...data.state,
        user,
      },
      controller,
    },
  }).models;
}

function loadLoans() {
  const { id } = Biblio.loanComponent.app.state.user;

  getLoans(id)
  .then((data) => {
    const loans = data
      .map((d) => {
        const formatStatus = () => {
          switch (d.status) {
            case 'active': return 'Ativo';
            case 'finished': return 'Finalizado';
            default: return d.status;
          }
        }

        return {
          ...d,
          status: formatStatus(),
          loan_date: new Date(d.loan_date).toLocaleDateString(),
          end_date: new Date(d.end_date).toLocaleDateString(),
          showRenewButton: (
            d.status === "active" &&
            (parseInt(d.renewals_allowed) - parseInt(d.renewal_count)) > 0
          ),
        }
      })
      .sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0);

    Biblio.loanComponent.app.state.loans.raw = loans.slice();
    Biblio.loanComponent.app.state.loans.data = loans.slice();
  })
  .catch((err) => {
    console.error(err);
    alertify.error("Ocorreu um erro na consulta dos empréstimos. Tente novamente em instantes.")
  })
  .finally(() => {
    Biblio.loanComponent.app.state.loans.isLoading = false
  });
}
