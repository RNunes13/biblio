
import { data } from '../data/index';
import { header as El } from '../../Globals/globals-selectors';
import { controller } from '../controller/index';

export default {
  init() {
    bindData();
  },
};

function bindData() {
  const user = JSON.parse(window.localStorage.getItem("@Biblio:user"));

  Biblio.headerComponent = Biblio.rivets.bind(El.headerComponent, {
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
