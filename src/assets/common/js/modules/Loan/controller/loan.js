
import axios from "axios";

export const loan = {
  async renew(_, scope) {
    const { id } = scope.loan;

    const confirmation = confirm(`O empréstimo ${id} será renovado.`);

    if (confirmation) {
      try {
        const resp = await axios.put('/api/book_loan/renew.php', { id });
  
        const { success, end_date, renewal_count, error } = resp.data;

        if (!success) throw error;

        scope.loan.end_date = new Date(end_date).toLocaleDateString();
        scope.loan.renewal_count = renewal_count;
        scope.loan.showRenewButton = (
          scope.loan.status === "Ativo" &&
          (parseInt(scope.loan.renewals_allowed) - parseInt(renewal_count)) > 0
        );

        alertify.success("Empréstimo renovado com sucesso");
      } catch (err) {
        console.error(err);

        if (err.code) {
          if (err.code === '@Biblio:maximumLimitReached') {
            alertify.warning("Este empréstimo não pode ser mais renovado. Ele alcançou o número máximo de renovações.");
          }
        } else {
          alertify.error("Ocorreu um erro na renovação do empréstimo.");
        }
      }
    }
  },
};
