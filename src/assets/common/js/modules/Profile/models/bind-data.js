
import { data } from '../data/index';
import { profile as El } from '../../Globals/globals-selectors';
import { controller } from '../controller/index';

export default {
  init() {
    bindData();
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
