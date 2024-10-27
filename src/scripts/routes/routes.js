import nowPlaying from '../views/pages/now-playing';
import upcoming from '../views/pages/upcoming';
import detail from '../views/pages/detail';
import like from '../views/pages/like';

const routes = {
  '/': nowPlaying,
  '/now-playing': nowPlaying,
  '/upcoming': upcoming,
  '/detail/:id': detail,
  '/like': like,
};

export default routes;
