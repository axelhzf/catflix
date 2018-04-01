import {
  EpisodesShowArgs,
  ShowQueryArgs,
  ShowsQueryArgs
} from '../schema/schema';
import { PopCornShow } from '../popcornApi/PopCornShow';
import { PopCornShowEpisode } from '../popcornApi/PopCornShowDetails';
import * as _ from 'lodash';
import { popcornApi } from '../popcornApi/popCornApi';

export const showsResolver = {
  Query: {
    async shows(obj: undefined, args: ShowsQueryArgs) {
      const shows = await popcornApi.getShows(args);
      return shows;
    },
    async show(obj: undefined, args: ShowQueryArgs) {
      const show = await popcornApi.getShow(args.id);
      return show;
    }
  },
  Show: {
    id: (show: PopCornShow) => show._id,
    numSeasons: (show: PopCornShow) => show.num_seasons,
    episodes: async (show: PopCornShow, args: EpisodesShowArgs) => {
      const id = show._id;
      const showDetails = await popcornApi.getShow(id);
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
        return { quality, url: torrent ? torrent.url : undefined };
      });
      return torrents;
    }
  }
};
