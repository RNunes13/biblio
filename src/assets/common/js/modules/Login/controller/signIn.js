
import { login as El } from '../../Globals/globals-selectors';
import qs from 'querystring';
import axios from 'axios';

function validForm(scope) {
  const { form } = scope.app.state;

  let hasError = false;

  if (!form.username.value) {
    scope.app.state.form.username.hasError = true;
    scope.app.state.form.username.error = 'Campo obrigatório';

    hasError = true;
  }

  if (!form.password.value) {
    scope.app.state.form.password.hasError = true;
    scope.app.state.form.password.error = 'Campo obrigatório';

    hasError = true;
  }

  return !hasError;
}

export const signIn = {
  submit(evt, scope) {
    evt.preventDefault();

    if (!validForm(scope)) return false;

    scope.app.state.form.isSubmiting = true;
    scope.app.state.form.buttonText = 'Validando...';

    const username = scope.app.state.form.username.value;
    const password = scope.app.state.form.password.value;

    axios.post('/api/users/login.php', { username, password })
    .then(({ data }) => {
      alertify.success('Login aceito');

      console.log(data);

      window.localStorage.setItem('@Biblio:user', JSON.stringify(data.user));

      const query = window.location.search.replace('?', '');
      const redirect = qs.parse(query).redirect_to || '/';

      window.location.href = window.location.origin + redirect;
    })
    .catch(({response }) => {
      const { error } = response.data;

      if (error.code === "@Biblio:InvalidCredentials") {
        alertify.error('Credenciais inválidas');
      } else {
        alertify.error(error.message);
      }
    })
    .finally(() => {
      scope.app.state.form.isSubmiting = false;
      scope.app.state.form.buttonText = 'Acessar';
    });
  },

  togglePassword(_, scope) {
    const { showPassword } = scope.app.state.form;

    El.passwordField.setAttribute('type', showPassword ? 'text' : 'password')
  }
};
