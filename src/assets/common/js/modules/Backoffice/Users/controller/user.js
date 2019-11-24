
import axios from 'axios';
import { getAddress, getPhones } from '../methods';

export const user = {
  close(_, scope) {
    scope.app.state.showModal = false;
    scope.app.state.users.selected = null;
  },

  setUser(_, scope) {
    scope.app.state.users.selected = scope.user;
    scope.app.state.showModal = true;
    scope.app.state.modalTitle = "Editar usuário";

    getPhones(scope.user.id)
      .then((phones) => {
        Biblio.adminUserComponent.app.state.users.selected.phones = phones.slice();
      })
      .catch((err) => {
        console.error(err);
        alertify.error('Ocorreu um erro na consulta telefones.');
      });

    
    getAddress(scope.user.id)
      .then((address) => {
        Biblio.adminUserComponent.app.state.users.selected.addresses = address.slice();
      })
      .catch((err) => {
        console.error(err);
        alertify.error('Ocorreu um erro na consulta endereços.');
      });
  },

  newUser(_, scope) {
    scope.app.state.users.selected = { _new: true, deleted: false };
    scope.app.state.users.selected.phones = [];
    scope.app.state.users.selected.addresses = [];
    scope.app.state.showModal = true;
    scope.app.state.modalTitle = "Novo usuário";
  },

  async save() {
    const { selected: user } = Biblio.adminUserComponent.app.state.users;
    const isNew = user._new;

    const data = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      cpf: user.cpf,
      role_id: user.role,
      deleted: user.deleted,
    }

    try {
      if (isNew) {
        const resp = await axios.post('/api/admin/users/create.php', data);

        if (!await savePhones(user.phones, resp.data.id) || !await saveAddresses(user.addresses, resp.data.id)) return;
      } else {
        if (!await savePhones(user.phones, user.id) || !await saveAddresses(user.addresses, user.id)) return;

        await axios.put('/api/admin/users/update.php', { ...data, id: user.id });
      }

      alertify.success(`Usuário ${isNew ? 'criado' : 'atualizado'} com sucesso.`);

      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      console.error(err);
      alertify.error(`Ocorreu um erro na ${isNew ? 'criação' : 'atualização'} do usuário.`);
    }
  },

  async delete(evt, scope) {
    evt.stopPropagation();

    const { id } = scope.user;

    const confirmation = confirm(`O usuário ${id} será deletado.`);

    if (confirmation) {
      try {
        await axios.delete(`/api/users/delete.php?id=${id}`);
  
        alertify.success('Usuário deletado com sucesso.');
  
        setTimeout(() => window.location.reload(), 2000);
      } catch (err) {
        console.error(err);
        alertify.error('Ocorreu um erro ao tentar deletar o usuário.');
      }
    }
  },

  async deletePhone(_, scope) {
    const { id, ddd, number, _new } = scope.phone;
    
    if (_new) {
      scope.app.state.users.selected.phones = scope.app.state.users.selected.phones.filter(p => p.id != id);
      return;
    }

    const confirm = window.confirm(`O telefone (${ddd}) ${number} será excluído.`);

    if (confirm) {
      axios.delete(`/api/user_phone/delete_by_id.php?id=${id}`)
      .then(() => {
        alertify.success('Telefone excluído com sucesso')
        scope.app.state.users.selected.phones = scope.app.state.users.selected.phones.filter(p => p.id != id);
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
      scope.app.state.users.selected.addresses = scope.app.state.users.selected.addresses.filter(a => a.id != id);
      return;
    }
    
    const confirm = window.confirm(`O endereço com o CEP ${zip_code} será excluído.`);

    if (confirm) {
      axios.delete(`/api/user_address/delete_by_id.php?id=${id}`)
      .then(() => {
        alertify.success('Endereço excluído com sucesso')
        scope.app.state.users.selected.addresses = scope.app.state.users.selected.addresses.filter(a => a.id != id);
      })
      .catch((err) => {
        console.error(err);
        alertify.error('Ocorreu um erro ao tentar excluir o endereço. Tente novamente em instantes.')
      });
    }
  },

  addPhone(_, scope) {
    scope.app.state.users.selected.phones = [
      ...scope.app.state.users.selected.phones,
      {
        id: new Date().getTime(),
        ddd: '',
        number: '',
        _new: true,
      }
    ]
  },

  addAddress(_, scope) {
    scope.app.state.users.selected.addresses = [
      ...scope.app.state.users.selected.addresses,
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

async function savePhones(phones, userId) {
  const validPhone = ({ ddd, number }) => ddd && number;

  try {
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

async function saveAddresses(addresses, userId) {
  const validAddress = ({ zip_code, street, number, neighborhood, city, uf }) => 
    !!zip_code && !!street && !!number & !!neighborhood && !!city && !!uf

  try {
    const newAddresses = addresses
      .filter(a => a._new)
      .filter(a => validAddress(a))
      .map(a => ({ ...a, user_id: userId  }));

    const updateAddresses = addresses
      .filter(a => !newAddresses.map(_a => _a.id).includes(a.id))
      .filter(a => validAddress(a));

    await axios.post('/api/user_address/update_all.php', updateAddresses);
    await axios.post('/api/user_address/create_list.php', newAddresses);

    return true;
  } catch(err) {
    console.error(err);
    alertify.error('Ocorreu um erro ao salvar o(s) endereço(s). Tente novamente em instantes.');

    return false;
  }
}
