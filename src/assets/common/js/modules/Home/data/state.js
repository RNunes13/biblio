
export const state = {
  showSearch: isMobile.any ? false : true,
  showSearchInfo: 'Buscar livros',
  books: {
    isLoading: true,
    data: [],
  },
  form: {
    isSubmiting: false,
    book: {
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
