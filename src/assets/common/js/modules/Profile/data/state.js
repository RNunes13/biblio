
export const state = {
  user: {},
  changePassword: false,
  changePasswordText: 'Alterar senha',
  form: {
    isSubmiting: false,
    buttonText: 'Salvar',
    name: {
      value: '',
    },
    email: {
      value: '',
      hasError: false,
      error: ''
    },
    username: {
      value: '',
      hasError: false,
      error: ''
    },
    cpf: {
      value: '',
      hasError: false,
      error: ''
    },
    currentPassword: {
      value: '',
      hasError: false,
      error: ''
    },
    newPassword: {
      value: '',
      hasError: false,
      error: ''
    },
    confirmationPassword: {
      value: '',
      hasError: false,
      error: ''
    },
  },
};
