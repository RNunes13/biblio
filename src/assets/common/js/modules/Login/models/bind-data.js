
import { data } from '../data/index';
import { login as El } from '../../Globals/globals-selectors';
import { controller } from '../controller/index';

export default {
  init() {
    bindData();
  },
};

function bindData() {
  Biblio.loginComponent = Biblio.rivets.bind(El.loginComponent, {
    app: {
      ...data,
      controller,
    },
  }).models;
}
