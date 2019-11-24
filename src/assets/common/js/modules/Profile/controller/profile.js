
import { profile as El } from '../../Globals/globals-selectors';
import axios from 'axios';

export const profile = {
  async submit(evt, scope) {
    evt.preventDefault();

    if (!await validForm(scope)) return false;

    scope.app.state.form.isSubmiting = true;
    scope.app.state.form.buttonText = 'Salvando...';

    if (
      !await savePhones(scope.app.state.form.phones) ||
      !await saveAddresses(scope.app.state.form.addresses)
    ) {
      scope.app.state.form.isSubmiting = false;
      scope.app.state.form.buttonText = 'Salvar';

      return;
    };

    const data = {
      id: scope.app.state.user.id,
      name: scope.app.state.form.name.value,
      username: scope.app.state.form.username.value,
      email: scope.app.state.form.email.value,
      cpf: scope.app.state.form.cpf.value
    }

    axios.post('/api/users/update.php', data)
    .then(({ data }) => {
      alertify.success('Perfil atualizado');

      scope.app.state.user = data;
      window.localStorage.setItem('@Biblio:user', JSON.stringify(data));
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
    const { id, ddd, number, _new } = scope.phone;
    
    if (_new) {
      scope.app.state.form.phones = scope.app.state.form.phones.filter(p => p.id != id);
      return;
    }

    const confirm = window.confirm(`O telefone (${ddd}) ${number} será excluído.`);

    if (confirm) {
      axios.delete(`/api/user_phone/delete_by_id.php?id=${id}`)
      .then(() => {
        alertify.success('Telefone excluído com sucesso')
        scope.app.state.form.phones = scope.app.state.form.phones.filter(p => p.id != id);
      })
      .catch((err) => {
        console.error(err);
        alertify.error('Ocorreu um erro ao tentar excluir o telefone. Tente novamente em instantes.')
      });
    }
  },

  async deleteAddress(_, scope) {
    const { id, zip_code, _new } = scope.address;
    
    if (_new) {
      scope.app.state.form.addresses = scope.app.state.form.addresses.filter(a => a.id != id);
      return;
    }
    
    const confirm = window.confirm(`O endereço com o CEP ${zip_code} será excluído.`);

    if (confirm) {
      axios.delete(`/api/user_address/delete_by_id.php?id=${id}`)
      .then(() => {
        alertify.success('Endereço excluído com sucesso')
        scope.app.state.form.addresses = scope.app.state.form.addresses.filter(a => a.id != id);
      })
      .catch((err) => {
        console.error(err);
        alertify.error('Ocorreu um erro ao tentar excluir o endereço. Tente novamente em instantes.')
      });
    }
  },

  addPhone(_, scope) {
    scope.app.state.form.phones = [
      ...scope.app.state.form.phones,
      {
        id: new Date().getTime(),
        ddd: '',
        number: '',
        _new: true,
      }
    ]
  },

  addAddress(_, scope) {
    scope.app.state.form.addresses = [
      ...scope.app.state.form.addresses,
      {
        id: new Date().getTime(),
        additional: null,
        city: '',
        neighborhood: '',
        number: '',
        street: '',
        uf: '',
        zip_code: '',
        _new: true,
      }
    ]
  },

  async getAddress(evt, scope) {
    const { zip_code } = scope.address;

    if (zip_code.length < 8 || !/[0-9]{8}/.test(zip_code)) {
      alertify.warning('O CEP está no formato inválido para consulta do endereço.');
      return;
    }
    
    try {
      scope.address.isSearching = true;

      const resp = await axios.get(`https://viacep.com.br/ws/${zip_code}/json/`);

      const { data } = resp;

      const { erro, bairro, localidade, logradouro, uf } = data;

      if (erro) {
        scope.address.street = "";
        scope.address.number = "";
        scope.address.additional = "";
        scope.address.neighborhood = "";
        scope.address.city = "";
        scope.address.uf = "";
        scope.address.isSearching = false;
        
        return;
      }

      scope.address.street = logradouro;
      scope.address.number = "";
      scope.address.additional = "";
      scope.address.neighborhood = bairro;
      scope.address.city = localidade;
      scope.address.uf = uf;

      scope.address.isSearching = false;
      evt.target.parentElement.parentElement.querySelector('#street_number').focus();
    } catch (err) {
      console.error(err);
      alertify.error("Ocorreu um erro na consulta do endereço.");
      scope.address.isSearching = false;
    }
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

async function savePhones(phones) {
  const validPhone = ({ ddd, number }) => ddd && number;

  try {
    const userId = Biblio.profileComponent.app.state.user.id;
    
    const newPhones = phones
      .filter(p => p._new)
      .filter(p => validPhone(p))
      .map(p => ({ ...p, user_id: userId  }));
    
    const updatePhones = phones
      .filter(p => !newPhones.map(_p => _p.id).includes(p.id))
      .filter(p => validPhone(p));

    await axios.post('/api/user_phone/update_all.php', updatePhones);
    await axios.post('/api/user_phone/create_list.php', newPhones);

    return true;
  } catch(err) {
    console.error(err);
    alertify.error('Ocorreu um erro ao salvar o(s) telefone(s). Tente novamente em instantes.');

    return false;
  }
}

async function saveAddresses(addresses) {
  const validAddress = ({ zip_code, street, number, neighborhood, city, uf }) =>
    zip_code && street && number & neighborhood && city && uf;

  try {
    const userId = Biblio.profileComponent.app.state.user.id;
    
    const newAddresses = addresses
      .filter(a => a._new)
      .filter(a => validAddress(a))
      .map(a => ({ ...a, user_id: userId  }));

    const updateAddresses = addresses
      .filter(a => !newAddresses.map(_a => _a.id).includes(a.id))
      .filter(a => validAddress(a));

    console.log(updateAddresses);

    await axios.post('/api/user_address/update_all.php', updateAddresses);
    await axios.post('/api/user_address/create_list.php', newAddresses);

    return true;
  } catch(err) {
    console.error(err);
    alertify.error('Ocorreu um erro ao salvar o(s) endereço(s). Tente novamente em instantes.');

    return false;
  }
}
