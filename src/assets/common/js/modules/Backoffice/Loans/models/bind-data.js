
import { data } from '../data/index';
import { admin_loans as El } from '../../../Globals/globals-selectors';
import { getLoans } from '../methods';
import { controller } from '../controller/index';

export default {
  init() {
    bindData();
    loadLoans();
  },
};

async function bindData() {
  const user = JSON.parse(window.localStorage.getItem('@Biblio:user'));

  if (!user || (user && !['1', '3'].includes(user.role))) {
    window.location.href = window.location.origin;
    return;
  }

  Biblio.adminLoanComponent = Biblio.rivets.bind(El.adminLoanComponent, {
    app: {
      props: data.props,
      state: {
        ...data.state,
        user,
      },
      controller,
    },
  }).models;
}

function loadLoans() {
  getLoans()
  .then((resp) => {
    const loans = resp.records
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
      .sort((a, b) => parseInt(a.id) > parseInt(b.id) ? 1 : parseInt(a.id) < parseInt(b.id) ? -1 : 0);

    Biblio.adminLoanComponent.app.state.loans.raw = loans.slice();
    Biblio.adminLoanComponent.app.state.loans.data = loans.slice();
  })
  .catch((err) => {
    console.error(err);
    alertify.error('Ocorreu um erro na consulta dos empréstimos.');
  })
  .finally(() => Biblio.adminLoanComponent.app.state.loans.isLoading = false);
}
