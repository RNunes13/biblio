import './utils/rivets-configure';
import './utils/rivets-formatters';
import './utils/rivets-binders';
import 'regenerator-runtime/runtime';

import globals from './modules/Globals/globals-index';

const init = () => {
  globals.init();
};

document.addEventListener('DOMContentLoaded', init);
