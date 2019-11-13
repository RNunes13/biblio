
export const state = {
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
