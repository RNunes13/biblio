
import { data } from '../data/index';
import { admin_publishers as El } from '../../../Globals/globals-selectors';
import { getPublishers } from '../methods';
import { controller } from '../controller/index';

export default {
  init() {
    bindData();
    loadPublishers();
  },
};

async function bindData() {
  const user = JSON.parse(window.localStorage.getItem('@Biblio:user'));

  if (!user || (user && user.role !== '1')) {
    window.location.href = window.location.origin;
    return;
  }

  Biblio.adminPublishersComponent = Biblio.rivets.bind(El.adminPublisherComponent, {
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

function loadPublishers() {
  getPublishers()
  .then((resp) => {
    const publishers = resp.records.sort((a, b) =>
      parseInt(a.id) > parseInt(b.id) ? 1 : parseInt(a.id) < parseInt(b.id) ? -1 : 0
    );

    Biblio.adminPublishersComponent.app.state.publishers.raw = publishers.slice();
    Biblio.adminPublishersComponent.app.state.publishers.data = publishers.slice();
  })
  .catch((err) => {
    console.error(err);
    alertify.error('Ocorreu um erro na consulta das editoras.');
  })
  .finally(() => Biblio.adminPublishersComponent.app.state.publishers.isLoading = false);
}
