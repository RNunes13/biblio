
import { data } from '../data/index';
import { register as El } from '../../Globals/globals-selectors';
import { controller } from '../controller/index';

export default {
  init() {
    bindData();
  },
};

function bindData() {
  Biblio.registerComponent = Biblio.rivets.bind(El.registerComponent, {
    app: {
      ...data,
      controller,
    },
  }).models;
}
