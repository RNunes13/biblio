
import { data } from '../data/index';
import { admin_users as El } from '../../../Globals/globals-selectors';
import { getUsers, getRoles } from '../methods';
import { controller } from '../controller/index';

export default {
  init() {
    bindData();
  },
};

async function bindData() {
  const user = JSON.parse(window.localStorage.getItem('@Biblio:user'));

  if (!user || (user && user.role !== '1')) {
    window.location.href = window.location.origin;
    return;
  }

  let roles = [];
  
  try {
    const data = await getRoles();
    roles = data.records;
  } catch(err) {
    console.error(`Error fetching roles -> ${err}`);
  }

  Biblio.adminUserComponent = Biblio.rivets.bind(El.adminUserComponent, {
    app: {
      props: {
        ...data.props,
        roles,
      },
      state: {
        ...data.state,
        user,
      },
      controller,
    },
  }).models;

  loadUsers();
}

function loadUsers() {
  getUsers()
  .then((resp) => {
    const users = resp.records
      .map((d) => {
        return {
          ...d,
          created_at: new Date(d.created_at).toLocaleDateString(),
        }
      })
      .sort((a, b) => parseInt(a.id) > parseInt(b.id) ? 1 : parseInt(a.id) < parseInt(b.id) ? -1 : 0);

    Biblio.adminUserComponent.app.state.users.raw = users.slice();
    Biblio.adminUserComponent.app.state.users.data = users.slice();
  })
  .catch((err) => {
    console.error(err);
    alertify.error('Ocorreu um erro na consulta dos usuários.');
  })
  .finally(() => Biblio.adminUserComponent.app.state.users.isLoading = false);
}
