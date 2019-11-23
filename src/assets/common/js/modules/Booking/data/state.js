
export const state = {
  bookings: {
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
    date: ''
  },
};
