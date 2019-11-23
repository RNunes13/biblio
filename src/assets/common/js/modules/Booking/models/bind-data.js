
import { data } from '../data/index';
import { controller } from '../controller/index';
import { bookingConfirmation as El } from '../../Globals/globals-selectors';

export default {
  init() {
    bindData();
  },
};

async function bindData() {
  Biblio.bookingComponent = Biblio.rivets.bind(El.bookingComponent, {
    app: {
      ...data,
      controller,
    },
  }).models;
}
