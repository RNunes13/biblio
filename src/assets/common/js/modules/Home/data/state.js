
export const state = {
  showSearch: isMobile.any ? false : true,
  showSearchInfo: 'Buscar livros',
  showModal: false,
  isSearching: false,
  books: {
    isLoading: true,
    raw: [],
    data: [],
    search: [],
    selected: {},
  },
  form: {
    isSubmiting: false,
    title: {
      value: '',
      error: '',
    },
    author: {
      value: '',
      error: '',
    },
    genre: {
      value: '',
      error: '',
    },
    publisher: {
      value: '',
      error: '',
    },
  },
};
