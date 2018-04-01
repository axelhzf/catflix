import { logger } from '../logger';
import * as _ from 'lodash';
import { ChromeCast } from '../ChromeCast/ChromeCast';
import { PopCornMovieTorrentQuality } from '../popcornApi/PopCornMovie';
import { PopCornShowEpisodeTorrents } from '../popcornApi/PopCornShowDetails';
import { Player } from '../Player/Player';
import {
  PauseMutationArgs,
  PlayEpisodeMutationArgs,
  PlayMovieMutationArgs,
  ResumeMutationArgs,
  StopMutationArgs
} from '../schema/schema';
import { popcornApi } from '../popcornApi/popCornApi';

const player = new Player();

export const playerResolver = {
  Query: {
    status: () => player.getStatus(),
    devices: async () => {
      const devices = await ChromeCast.searchDevices();
      return devices;
    }
  },
  Mutation: {
    playMovie: async (obj: undefined, args: PlayMovieMutationArgs) => {
      const movie = await popcornApi.getMovie(args.id);
      if (!movie) throw new Error(`movie ${args.id} not found`);
      const torrent = args.quality
        ? movie.torrents.en[args.quality] || bestTorrent(movie.torrents.en)
        : bestTorrent(movie.torrents.en);
      if (!torrent) {
        throw new Error('torrent not found');
      }
      player
        .load({
          type: 'movie',
          movie,
          torrent,
          subtitleLang: args.subtitleLang || undefined,
          device: args.device
        })
        .catch(e => console.error(e));
    },
    playEpisode: async (obj: undefined, args: PlayEpisodeMutationArgs) => {
      const show = await popcornApi.getShow(args.showId);
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
        .load({
          type: 'episode',
          show,
          episode,
          torrent,
          subtitleLang: args.subtitleLang || undefined,
          device: args.device
        })
        .catch(e => console.error(e));
    },
    pause: async (obj, args: PauseMutationArgs) => {
      await player.pause(args.device);
      return true;
    },
    resume: async (obj, args: ResumeMutationArgs) => {
      await player.play(args.device);
      return true;
    },
    stop: async (obj, args: StopMutationArgs) => {
      await player.stop(args.device);
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
