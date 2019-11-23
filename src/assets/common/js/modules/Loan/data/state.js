
export const state = {
  loans: {
    isLoading: true,
    raw: [],
    data: [],
  },
  showSearch: isMobile.any ? false : true,
  showSearchInfo: 'Exibir filtros',
  isFiltering: false,
  form: {
    code: '',
    book: '',
    status: '',
    loan_date: '',
    end_date: '',
  },
};
