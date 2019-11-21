
import { profile as El } from '../../Globals/globals-selectors';
import axios from 'axios';

export const profile = {
  async submit(evt, scope) {
    evt.preventDefault();

    if (!await validForm(scope)) return false;

    scope.app.state.form.isSubmiting = true;
    scope.app.state.form.buttonText = 'Salvando...';

    setTimeout(() => {
      scope.app.state.form.isSubmiting = false;
      scope.app.state.form.buttonText = 'Salvar';
    }, 1000);

    return;

    axios.post('/api/users/update.php', {})
    .then(({ data }) => {
      alertify.success('Perfil atualizado');

      scope.app.state.user = data;
      window.localStorage.setItem('@Biblio:user', data);
    })
    .catch(({response }) => {
      const { error } = response.data;

      alertify.error(error.message);
    })
    .finally(() => {
      scope.app.state.form.isSubmiting = false;
      scope.app.state.form.buttonText = 'Salvar';
    });
  },

  changePassword(_, scope) {
    const changePassword = scope.app.state.changePassword;

    scope.app.state.changePassword = !changePassword;
    scope.app.state.changePasswordText = scope.app.state.changePassword ? 'Esconder senha' : 'Alterar senha';
  },

  async confirmChangePassword(_, scope) {
    if (!validPasswords(scope)) return;

    const { currentPassword, newPassword } = scope.app.state.form;
    const { id } = scope.app.state.user;

    try {
      const resp = await axios.post('/api/users/update_password.php', {
        userId: id,
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      });
      
      const { data } = resp;

      if (!data.success) {
        const { error } = data;

        if (error.code === "@Biblio:incorrectPassword") {
          alertify.error("A senha atual não corresponde com a senha do usuário.");
        }

        if (error.code === "@Biblio:newPasswordSameAsCurrentPassword") {
          alertify.warning("A nova senha não pode ser igual a senha atual.");
        }

        return;
      }

      alertify.success("Senha modificada com sucesso.");

      scope.app.state.form.currentPassword.value = "";
      scope.app.state.form.newPassword.value = "";
      scope.app.state.form.confirmationPassword.value = "";
      scope.app.state.changePassword = false;
      scope.app.state.changePasswordText = 'Alterar senha';
    } catch (error) {
      console.error(error);
      alertify.error("Ocorreu um erro na atualização da senha. Tente novamente em instantes.");
    }
  },

  async deletePhone(_, scope) {
    console.log(scope.phone)
  },

  async deleteAddress(_, scope) {
    console.log(scope.address)
  }
};

function validPasswords(scope) {
  const { currentPassword, newPassword, confirmationPassword } = scope.app.state.form;

  let hasError = !currentPassword.value || !newPassword.value || !confirmationPassword.value;

  scope.app.state.form.currentPassword.hasError = !currentPassword.value ? true : false;
  scope.app.state.form.newPassword.hasError = !newPassword.value ? true : false;
  scope.app.state.form.confirmationPassword.hasError = !confirmationPassword.value ? true : false;

  if (!currentPassword.value) scope.app.state.form.currentPassword.error = 'Campo obrigatório';

  if (!newPassword.value) scope.app.state.form.newPassword.error = 'Campo obrigatório';

  if (!confirmationPassword.value) scope.app.state.form.confirmationPassword.error = 'Campo obrigatório';

  if (newPassword.value && confirmationPassword.value && newPassword.value !== confirmationPassword.value) {
    alertify.warning('A confirmação da senha não corresponde a nova senha.');
    hasError = true;
  }

  return !hasError;
}

function validCPF(cpf) {
  const digits = cpf.substring(0, 9);
  const checker = cpf.substring(9, 11);

  let eleventhDigit = digits.split('')
    .reduce((accumulator, value, idx) =>
      accumulator + (parseInt(value) * (10 - idx)), 0
    ) * 10 % 11;

  eleventhDigit = eleventhDigit < 10 ? eleventhDigit : 0;

  let twelfthDigit = [...digits.split(''), eleventhDigit]
    .reduce((accumulator, value, idx) => 
      accumulator + (parseInt(value) * (11 - idx)), 0
    ) * 10 % 11;

  twelfthDigit = twelfthDigit < 10 ? twelfthDigit : 0;

  return checker === `${eleventhDigit}${twelfthDigit}`;
}

async function validUsername(username, usernameUser = "") {
  try {
    const resp = await axios.post('/api/users/check_username.php', { username, usernameUser });
    
    const { data } = resp;

    return data;
  } catch (err) {
    console.error(err);
    alertify.error('Ocorreu um erro na verificação do nome de usuário. Tente novamente em instantes.')
  }
}

async function validForm(scope) {
  const { form, user } = scope.app.state;

  let hasError = false;
  let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRegex.test(form.email.value)) {
    scope.app.state.form.email.hasError = true;
    scope.app.state.form.email.error = 'Email inválido';

    hasError = true;
  } else {
    scope.app.state.form.email.hasError = false;
  }

  if (!validCPF(form.cpf.value)) {
    scope.app.state.form.cpf.hasError = true;
    scope.app.state.form.cpf.error = 'CPF inválido';

    hasError = true;
  } else {
    scope.app.state.form.cpf.hasError = false;
  }

  if (!await validUsername(form.username.value, user.username)) {
    scope.app.state.form.username.hasError = true;
    scope.app.state.form.username.error = 'Usuário já em uso';

    hasError = true;
  } else {
    scope.app.state.form.username.hasError = false;
  }

  return !hasError;
}
