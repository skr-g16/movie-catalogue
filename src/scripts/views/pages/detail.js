import urlParser from '../../routes/url-parser';
import theMovieDbSource from '../../data/themoviedb-source';
import { createMovieDetailTemplate } from '../templates/template-creator';
import likeButtonInitiator from '../../utils/like-buton-initiator';

const Detail = {
  async render() {
    return `
      <div id="movie" class="movie"></div>
      <div id="likeButtonContainer"></div>
    `;
  },

  async afterRender() {
    const url = urlParser.parseActiveWithoutCombiner();
    const movie = await theMovieDbSource.detailMovie(url.id);
    const movieContainer = document.querySelector('#movie');
    movieContainer.innerHTML = createMovieDetailTemplate(movie);
    likeButtonInitiator.init({
      likeButtonContainer: document.querySelector('#likeButtonContainer'),
      movie: {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average,
      },
    });
  },
};

export default Detail;
