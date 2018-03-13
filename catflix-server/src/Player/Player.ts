import { logger } from '../logger';
import { TorrentStreaming } from '../ChromeCast/TorrentStreaming';
import { ChromeCast } from '../ChromeCast/ChromeCast';
import { SubtitlesServer } from '../ChromeCast/SubtitlesServer';
import { PopCornShow } from '../PopcornApi/PopCornShow';
import {
  PopCornShowDetailsTorrent,
  PopCornShowEpisode
} from '../PopcornApi/PopCornShowDetails';
import { PopCornMovie, PopCornMovieTorrent } from '../PopcornApi/PopCornMovie';
import { Status, ServerStatus } from '../schema/schema';

export class Player {
  private _status: ServerStatus = 'IDLE';
  private torrentStreaming = new TorrentStreaming();
  private chromeCast = new ChromeCast();
  private subtitlesServer = new SubtitlesServer();

  constructor() {}

  getStatus(): Status {
    const status = {
      server: this._status,
      chromecast: this.chromeCast.playerState,
      device: this.chromeCast.getDeviceName(),
      torrent: this.torrentStreaming.getStats()
    };
    return status;
  }

  async loadEpisode(args: LoadEpisodeArgs) {
    try {
      const url = args.torrent.url;
      logger.info('streaming magnet', url);
      this._status = 'DOWNLOADING_TORRENT';
      const streamingTorrent = await this.torrentStreaming.stream(url);
      logger.info('streaming torrent', streamingTorrent.file);
      let subtitlesUrl;
      if (args.subtitleLang) {
        this._status = 'DOWNLOADING_SUBTITLE';
        subtitlesUrl = await this.subtitlesServer.serve(
          {
            type: 'episode',
            imdbid: args.show.imdb_id,
            season: args.episode.season,
            episode: args.episode.episode
          },
          streamingTorrent.file.length,
          args.subtitleLang
        );
      }
      this._status = 'LAUNCHING_CHROMECAST';
      await this.chromeCast.load({
        url: streamingTorrent.url,
        title: streamingTorrent.file.name,
        imageUrl:
          args.show.images.poster ||
          args.show.images.banner ||
          args.show.images.fanart,
        subtitlesUrl,
        device: args.device
      });
      this._status = 'PLAYING';
    } catch (e) {
      logger.error(e);
      this._status = 'ERROR';
    }
  }

  async loadMovie(args: LoadMovieArgs) {
    try {
      const url = args.torrent.url;
      this._status = 'DOWNLOADING_TORRENT';
      logger.info('streaming magnet', url);
      const streamingTorrent = await this.torrentStreaming.stream(url);
      logger.info('streaming torrent', streamingTorrent.file);
      this._status = 'DOWNLOADING_SUBTITLE';
      let subtitlesUrl;
      if (args.subtitleLang) {
        subtitlesUrl = await this.subtitlesServer.serve(
          { type: 'movie', imdbid: args.movie.imdb_id },
          streamingTorrent.file.length,
          args.subtitleLang
        );
      }
      this._status = 'LAUNCHING_CHROMECAST';
      await this.chromeCast.load({
        url: streamingTorrent.url,
        title: streamingTorrent.file.name,
        subtitlesUrl,
        imageUrl:
          args.movie.images.poster ||
          args.movie.images.banner ||
          args.movie.images.fanart,
        device: args.device
      });
      this._status = 'PLAYING';
    } catch (e) {
      logger.error(e);
      this._status = 'ERROR';
    }
  }

  pause() {
    return this.chromeCast.pause();
  }

  play() {
    return this.chromeCast.play();
  }

  async stop() {
    await this.chromeCast.stop();
    await this.subtitlesServer.destroy();
    await this.torrentStreaming.destroy();
  }
}

type LoadEpisodeArgs = {
  show: PopCornShow;
  episode: PopCornShowEpisode;
  torrent: PopCornShowDetailsTorrent;
  subtitleLang?: string;
  device?: string;
};

type LoadMovieArgs = {
  movie: PopCornMovie;
  torrent: PopCornMovieTorrent;
  subtitleLang: string | undefined;
  device: string | undefined;
};
