
import globalsInit from './globals-init';
import globalsOverlay from './globals-overlay';
import globalsBackTop from './globals-back-top';

export default {
  init() {
    globalsInit.init();
    globalsOverlay.init();
    globalsBackTop.init();
  },
};
