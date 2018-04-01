import * as _ from 'lodash';
import { PopCornMovie } from '../popcornApi/PopCornMovie';
import { MovieQueryArgs, MoviesQueryArgs } from '../schema/schema';
import { popcornApi } from '../popcornApi/popCornApi';

export const moviesResolver = {
  Query: {
    movies(obj, args: MoviesQueryArgs) {
      return popcornApi.getMovies(args);
    },
    movie(obj, args: MovieQueryArgs) {
      return popcornApi.getMovie(args.id);
    }
  },
  Movie: {
    id: (movie: PopCornMovie) => movie._id,
    torrents(movie: PopCornMovie) {
      const torrents = _.flatMap(movie.torrents, (torrentQuality, lang) =>
        _.map(torrentQuality, (torrent, quality) => ({
          lang,
          quality,
          url: torrent ? torrent.url : undefined
        }))
      );
      return torrents;
    }
  }
};
