import nowPlaying from '../views/pages/now-playing';
import upcoming from '../views/pages/upcoming';
import detail from '../views/pages/detail';

const routes = {
  '/': nowPlaying,
  '/now-playing': nowPlaying,
  '/upcoming': upcoming,
  '/detail/:id': detail,
};

export default routes;
