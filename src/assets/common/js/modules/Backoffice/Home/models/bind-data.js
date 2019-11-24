
import { data } from '../data/index';
import { admin_home as El } from '../../../Globals/globals-selectors';
import { controller } from '../controller/index';

export default {
  init() {
    bindData();
  },
};

async function bindData() {
  const user = JSON.parse(window.localStorage.getItem('@Biblio:user'));

  if (!user || (user && !['1', '2', '3'].includes(user.role))) {
    window.location.href = window.location.origin;
    return;
  }

  Biblio.adminHomeComponent = Biblio.rivets.bind(El.adminComponent, {
    app: {
      ...data,
      controller,
    },
  }).models;
}
