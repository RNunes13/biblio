
export const state = {
  showSearch: isMobile.any ? false : true,
  showSearchInfo: 'Buscar livros',
  showModal: false,
  books: {
    isLoading: true,
    data: [],
    selected: {
      id: 1,
      title: "Ideias para futuramente não ficar no passado",
      author: "Guilherme Machado",
      genre: "Autoajuda",
      edition: null,
      release_year: "2019",
      isbn: "9788545203735",
      active: "1",
      internal_identification: null,
      number_pages: "208", 
      quantity: "10",
      publishing_company_id: "2",
      thumbnail: "https://live.staticflickr.com/65535/49069862456_83dc54fe2b_o.jpg",
      created_at: "2019-11-15 13:18:54",
      updated_at: "2019-11-15 18:20:13"
    },
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
