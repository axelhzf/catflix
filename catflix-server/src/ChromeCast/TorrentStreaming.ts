import * as peerflix from 'peerflix';
import { v4 as internalIp } from 'internal-ip';
import * as magnet from 'magnet-uri';
import * as enableDestroy from 'server-destroy';
import { logger } from '../logger';

const TORRENT_PORT = 4102;

export class TorrentStreaming {
  private engine: undefined | any;

  getInfo(url: string) {
    return magnet.decode(url) as MagnetInfo;
  }

  async stream(url: string): Promise<StreamResponse> {
    await this.destroy();
    logger.info('starting torrent server');
    this.engine = await this.startEngine(url);
    const ip = await internalIp();
    const file = this.engine.server.index;
    return {
      url: `http://${ip}:${this.engine.server.address().port}`,
      file: {
        name: file.name,
        path: file.path,
        length: file.length
      }
    };
  }

  private startEngine(torrent: any) {
    return new Promise((resolve, reject) => {
      const engine = peerflix(torrent, { port: TORRENT_PORT });
      engine.server.once('listening', () => {
        logger.info('torrent server started');
        resolve(engine);
      });
      enableDestroy(engine.server);
    });
  }

  async destroy() {
    return new Promise(resolve => {
      if (this.engine) {
        logger.info('destroying torrent server');
        return this.engine.server.destroy(resolve);
      }
      resolve();
    });
  }
}

type MagnetInfo = {
  xt: string;
  dn: string;
  tr: string[];
  infoHash: string;
  //infoHashBuffer: string;
  name: string;
  announce: string[];
};

type StreamResponse = {
  url: string;
  file: {
    name: string;
    path: string;
    length: number;
  };
};
