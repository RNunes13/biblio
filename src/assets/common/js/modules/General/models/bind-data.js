
import { data } from '../data/index';
import { header, navbar } from '../../Globals/globals-selectors';
import { controller } from '../controller/index';

export default {
  init() {
    bindData();
  },
};

function bindData() {
  const user = JSON.parse(window.localStorage.getItem("@Biblio:user"));

  const obj = {
    app: {
      props: data.props,
      state: {
        ...data.state,
        user,
      },
      controller,
    },
  };

  Biblio.headerComponent = Biblio.rivets.bind(header.headerComponent, obj).models;
  Biblio.navbarComponent = Biblio.rivets.bind(navbar.navbarComponent, obj).models;
}
