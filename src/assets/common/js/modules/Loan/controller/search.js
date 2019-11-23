
import { removeSpecialCharacters } from '../../../utils/remove-special-characters';

export const search = {
  clear(_, scope) {
    scope.app.state.form.code = '';
    scope.app.state.form.book = '';
    scope.app.state.form.status = '';
    scope.app.state.form.loan_date = '';
    scope.app.state.form.end_date = '';
    
    scope.app.state.isFiltering = false;
    scope.app.state.loans.data = [];
    scope.app.state.loans.data = scope.app.state.loans.raw.slice();
  },

  toggle(_, scope) {
    scope.app.state.showSearch = !scope.app.state.showSearch;
    scope.app.state.showSearchInfo = scope.app.state.showSearch ? 'Ocultar filtros' : 'Exibir filtros';
  },

  onChange(evt, scope) {
    const field = evt.target.name;
    const value = evt.target.value;
    const loans = scope.app.state.loans.raw;

    const filteredLoans = loans.filter((loan) => {
      if (field !== 'loan_date' && field !== 'end_date') {
        const formattedField = removeSpecialCharacters((loan[field] || "").toLocaleLowerCase());
        const formattedValue = removeSpecialCharacters(value.toLocaleLowerCase().trim());

        return formattedField.match(formattedValue);
      } else {
        if (!value) return;

        const timeFromValue = new Date(value).setUTCHours(3);
        const date = new Date(field === 'loan_date' ? loan.loan_date : loan.end_date).toLocaleDateString();

        return timeFromValue === new Date(date).getTime();
      }
    });

    scope.app.state.loans.data = [];
    scope.app.state.loans.data = filteredLoans;
    
    scope.app.state.isFiltering = false;
  }
};
