import api from './parserApi/api.js';
import auth from './parserApi/auth.js';

export const startWatcker = async () => {
  api.update()
}

(async () => {
  await auth();

})();


