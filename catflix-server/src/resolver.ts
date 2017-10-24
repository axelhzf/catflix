import * as _ from 'lodash';
import { PopCornApi } from './PopcornApi/PopCornApi';
import {
  PopCornMovie,
  PopCornMovieTorrentQuality
} from './PopcornApi/PopCornMovie';
import {
  EpisodesShowArgs,
  MovieQueryArgs,
  MoviesQueryArgs,
  ShowsQueryArgs,
  PlayEpisodeMutationArgs,
  PlayMovieMutationArgs,
  ShowQueryArgs
} from './schema/schema';
import { PopCornShow } from './PopcornApi/PopCornShow';
import {
  PopCornShowEpisode,
  PopCornShowEpisodeTorrents
} from './PopcornApi/PopCornShowDetails';
import { Player } from './Player/Player';
import { logger } from './logger';
import { ChromeCast } from './ChromeCast/ChromeCast';

const popCornApi = new PopCornApi();
const player = new Player();

export default {
  Query: {
    async movies(obj: undefined, args: MoviesQueryArgs) {
      return await popCornApi.getMovies(args.page);
    },
    async movie(obj: undefined, args: MovieQueryArgs) {
      return await popCornApi.getMovie(args.id);
    },
    async shows(obj: undefined, args: ShowsQueryArgs) {
      const shows = await popCornApi.getShows(args.page);
      return shows;
    },
    async show(obj: undefined, args: ShowQueryArgs) {
      const show = await popCornApi.getShow(args.id);
      return show;
    },
    status: () => player.getStatus(),
    devices: async () => {
      const devices = await ChromeCast.searchDevices();
      return devices;
    }
  },
  Movie: {
    id: (movie: PopCornMovie) => movie._id,
    torrents(movie: PopCornMovie) {
      const torrents = _.flatMap(movie.torrents, (torrentQuality, lang) =>
        _.map(torrentQuality, (torrent, quality) => ({
          lang,
          quality,
          url: torrent.url
        }))
      );
      return torrents;
    }
  },
  Show: {
    id: (show: PopCornShow) => show._id,
    numSeasons: (show: PopCornShow) => show.num_seasons,
    episodes: async (show: PopCornShow, args: EpisodesShowArgs) => {
      const id = show._id;
      const showDetails = await popCornApi.getShow(id);
      const episodes =
        args.limit == null
          ? showDetails.episodes
          : showDetails.episodes.slice(0, args.limit);
      return episodes;
    }
  },
  Episode: {
    id: (episode: PopCornShowEpisode) => episode.tvdb_id,
    torrents(episode: PopCornShowEpisode) {
      const torrents = _.map(episode.torrents, (torrent, quality) => {
        return { quality, url: torrent.url };
      });
      return torrents;
    }
  },
  Mutation: {
    playMovie: async (obj: undefined, args: PlayMovieMutationArgs) => {
      const movie = await popCornApi.getMovie(args.id);
      if (!movie) throw new Error(`movie ${args.id} not found`);
      const torrent = args.quality
        ? movie.torrents.en[args.quality] || bestTorrent(movie.torrents.en)
        : bestTorrent(movie.torrents.en);
      if (!torrent) {
        throw new Error('torrent not found');
      }
      player
        .loadMovie({
          movie,
          torrent,
          subtitleLang: args.subtitleLang,
          device: args.device
        })
        .catch(e => console.error(e));
    },
    playEpisode: async (obj: undefined, args: PlayEpisodeMutationArgs) => {
      console.log('play episode args', args);
      const show = await popCornApi.getShow(args.showId);
      if (!show) throw new Error(`show ${args.showId} not found`);
      const episode = _.find(
        show.episodes,
        episode =>
          episode.season === args.season && episode.episode === args.episode
      );
      if (!episode) {
        throw new Error(
          `episode season ${args.season} episode ${args.episode} not found`
        );
      }

      logger.info('selecting torrent', episode.torrents, args.quality);

      const torrent = args.quality
        ? episode.torrents[args.quality] || bestTorrent(episode.torrents)
        : bestTorrent(episode.torrents);

      logger.info('torrent selected', torrent);

      if (!torrent) {
        throw new Error(`torrent not found`);
      }
      player
        .loadEpisode({
          show,
          episode,
          torrent,
          subtitleLang: args.subtitleLang,
          device: args.device
        })
        .catch(e => console.error(e));
    },
    pause: async () => {
      await player.pause();
      return true;
    },
    resume: async () => {
      await player.play();
      return true;
    },
    stop: async () => {
      await player.stop()
      return true;
    }
  }
};

function bestTorrent(
  torrents: PopCornMovieTorrentQuality | PopCornShowEpisodeTorrents
) {
  return (
    torrents['1080p'] || torrents['720p'] || torrents['480p'] || torrents['0']
  );
}
