
import { register as El } from '../../Globals/globals-selectors';
import axios from 'axios';

export const signUp = {
  submit(evt, scope) {
    evt.preventDefault();

    if (!validForm(scope)) return false;

    scope.app.state.form.isSubmiting = true;
    scope.app.state.form.buttonText = 'Validando...';

    const name = scope.app.state.form.name.value;
    const email = scope.app.state.form.email.value;
    const username = scope.app.state.form.username.value.toLocaleLowerCase();
    const password = scope.app.state.form.password.value;

    axios.post('/api/users/register.php', { name, email, username, password })
    .then(({ data }) => {
      alertify.success(`Conta criada, seja bem-vindo ${name}!`);

      window.localStorage.setItem('@Biblio:user', JSON.stringify(data));

      setTimeout(() => window.location.href = window.location.origin, 2000);
    })
    .catch(() => {
      alertify.error("Ocorre um erro no cadastro. Tente novamente em instantes.");
    })
    .finally(() => {
      scope.app.state.form.isSubmiting = false;
      scope.app.state.form.buttonText = 'Cadastrar';
    });
  },

  togglePassword(_, scope) {
    const { showPassword } = scope.app.state.form;

    El.passwordField.setAttribute('type', showPassword ? 'text' : 'password')
  }
};

function validForm(scope) {
  const { name, email, username, password } = scope.app.state.form;

  let hasError = false;
  let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!name.value) {
    scope.app.state.form.name.hasError = true;
    scope.app.state.form.name.error = 'Campo obrigatório';

    hasError = true;
  } else {
    scope.app.state.form.name.hasError = false;
  }

  if (!email.value) {
    scope.app.state.form.email.hasError = true;
    scope.app.state.form.email.error = 'Campo obrigatório';

    hasError = true;
  } else if (!emailRegex.test(email.value)) {
    scope.app.state.form.email.hasError = true;
    scope.app.state.form.email.error = 'Email inválido';

    hasError = true;
  } else {
    scope.app.state.form.email.hasError = false;
  }

  if (!username.value) {
    scope.app.state.form.username.hasError = true;
    scope.app.state.form.username.error = 'Campo obrigatório';

    hasError = true;
  } else {
    scope.app.state.form.username.hasError = false;
  }

  if (!password.value) {
    scope.app.state.form.password.hasError = true;
    scope.app.state.form.password.error = 'Campo obrigatório';

    hasError = true;
  } else if (password.value.length < 6) {
    scope.app.state.form.password.hasError = true;
    scope.app.state.form.password.error = 'A senha precisa ter no mínimo 6 caracteres';

    hasError = true;
  } else {
    scope.app.state.form.password.hasError = false;
  }

  return !hasError;
}
