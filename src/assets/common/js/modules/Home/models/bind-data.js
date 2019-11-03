
import { data } from '../data/index';
import { home as El } from '../../Globals/globals-selectors';
import { controller } from '../controller/index';

export default {
  init() {
    bindData();
  },
};

function bindData() {
  Biblio.homeComponent = Biblio.rivets.bind(El.$homeComponent, {
    app: {
      ...data,
      controller,
    },
  }).models;
}
