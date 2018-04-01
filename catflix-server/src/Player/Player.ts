import { logger } from '../logger';
import { TorrentStreaming } from '../ChromeCast/TorrentStreaming';
import { ChromeCast } from '../ChromeCast/ChromeCast';
import { SubtitlesServer } from '../ChromeCast/SubtitlesServer';
import { PopCornShow } from '../popcornApi/PopCornShow';
import {
  PopCornShowDetailsTorrent,
  PopCornShowEpisode
} from '../popcornApi/PopCornShowDetails';
import { PopCornMovie, PopCornMovieTorrent } from '../popcornApi/PopCornMovie';
import { Status, ServerStatus } from '../schema/schema';
import { MediaId } from '../types/MediaId';

export class Player {
  private _status: ServerStatus = 'IDLE';
  private torrentStreaming = new TorrentStreaming();
  private chromeCast = new ChromeCast();
  private subtitlesServer = new SubtitlesServer();
  private currentLoadArgs: LoadMediaArgs | undefined;
  private currentLoad: Promise<void> | undefined;

  constructor() {}

  getStatus(): Status {
    const status = {
      filename: this.torrentStreaming.getFilename() || '',
      cover: this.currentLoadArgs
        ? this.getImage(this.currentLoadArgs)
        : undefined,
      server: this._status,
      chromecast: this.chromeCast.playerState,
      device: this.chromeCast.getDeviceName(),
      torrent: this.torrentStreaming.getStats()
    };
    return status;
  }

  async load(args: LoadMediaArgs) {
    await this.stop(args.device);
    this.currentLoad = this.internalLoad(args);
    return this.currentLoad;
  }

  private async internalLoad(args: LoadMediaArgs) {
    try {
      const url = args.torrent.url;
      logger.info('streaming magnet', url);
      this._status = 'DOWNLOADING_TORRENT';
      const streamingTorrent = await this.torrentStreaming.stream(url);
      logger.info('streaming torrent', streamingTorrent.file);
      let subtitlesUrl;
      if (args.subtitleLang) {
        this._status = 'DOWNLOADING_SUBTITLE';
        [subtitlesUrl] = await Promise.all([
          this.subtitlesServer.serve(
            this.getMediaId(args),
            streamingTorrent.file.length,
            args.subtitleLang
          ),
          this.torrentStreaming.waitForInitialDownload()
        ]);
      } else {
        await this.torrentStreaming.waitForInitialDownload();
      }
      this._status = 'LAUNCHING_CHROMECAST';
      await this.chromeCast.load({
        url: streamingTorrent.url,
        title: streamingTorrent.file.name,
        imageUrl: this.getImage(args),
        subtitlesUrl,
        device: args.device
      });
      this._status = 'PLAYING';
    } catch (e) {
      logger.error(e);
      this._status = 'ERROR';
    }
  }

  private getMediaId(args: LoadMediaArgs): MediaId {
    if (args.type === 'movie') {
      return {
        type: 'movie',
        imdbid: args.movie.imdb_id
      };
    }
    return {
      type: 'episode',
      imdbid: args.show.imdb_id,
      season: args.episode.season,
      episode: args.episode.episode
    };
  }

  private getImage(args: LoadMediaArgs): string | undefined {
    if (args.type === 'movie') {
      return (
        args.movie.images.poster ||
        args.movie.images.banner ||
        args.movie.images.fanart
      );
    }
    return (
      args.show.images.poster ||
      args.show.images.banner ||
      args.show.images.fanart
    );
  }

  pause(device: string) {
    return this.chromeCast.pause(device);
  }

  play(device: string) {
    return this.chromeCast.play(device);
  }

  async stop(device: string) {
    logger.info('stopping player');
    if (this.currentLoad) {
      logger.info('loading in progress, canceling...');
      this.currentLoad.cancel();
      logger.info('current load canceled');
    }
    await this.chromeCast.stop(device);
    await this.subtitlesServer.destroy();
    await this.torrentStreaming.destroy();
  }
}

type LoadMediaArgs = LoadEpisodeArgs | LoadMovieArgs;

type LoadEpisodeArgs = {
  type: 'episode';
  show: PopCornShow;
  episode: PopCornShowEpisode;
  torrent: PopCornShowDetailsTorrent;
  subtitleLang?: string;
  device: string;
};

type LoadMovieArgs = {
  type: 'movie';
  movie: PopCornMovie;
  torrent: PopCornMovieTorrent;
  subtitleLang?: string;
  device: string;
};
