
import { data } from '../data/index';
import { controller } from '../controller/index';
import { getAddress, getPhones } from '../methods';
import { profile as El } from '../../Globals/globals-selectors';

export default {
  init() {
    bindData();
    loadPhones();
    loadAddress();
  },
};

function bindData() {
  const user = JSON.parse(window.localStorage.getItem('@Biblio:user'));

  if (!user) {
    window.location.href = window.location.origin;
    return;
  }

  const formData = Object.keys(user)
    .filter(key => data.state.form[key])
    .map(key => { return { [key]: user[key] } });

  formData.forEach((d) => {
    data.state.form[Object.keys(d)[0]]['value'] = Object.values(d)[0];
  });

  Biblio.profileComponent = Biblio.rivets.bind(El.profileComponent, {
    app: {
      props: data.props,
      state: {
        ...data.state,
        user,
      },
      controller,
    },
  }).models;
}

function loadPhones() {
  getPhones(Biblio.profileComponent.app.state.user.id)
  .then((phones) => {
    Biblio.profileComponent.app.state.user.phones = phones.slice();
    Biblio.profileComponent.app.state.form.phones = phones.slice();
  })
  .catch((err) => {
    console.error(err);
    alertify.error('Ocorreu um erro na consulta telefones.');
  });
}

function loadAddress() {
  getAddress(Biblio.profileComponent.app.state.user.id)
  .then((address) => {
    Biblio.profileComponent.app.state.user.addresses = address.slice();
    Biblio.profileComponent.app.state.form.addresses = address.slice();
  })
  .catch((err) => {
    console.error(err);
    alertify.error('Ocorreu um erro na consulta endereços.');
  });
}
