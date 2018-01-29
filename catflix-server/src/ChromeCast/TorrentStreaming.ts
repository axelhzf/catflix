import { v4 as internalIp } from 'internal-ip';
import * as magnet from 'magnet-uri';
import * as peerflix from 'peerflix';
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
      const opts = {
        port: TORRENT_PORT,
        tmp: __dirname + '/../../../tmp'
      };
      const engine = peerflix(torrent, opts);
      engine.server.once('listening', () => {
        logger.info('torrent server started');
        resolve(engine);
      });
      enableDestroy(engine.server);
    });
  }

  getStats(): Stats {
    if (!this.engine) {
      return {totalLength: 0, downloaded: 0, uploaded: 0, downloadSpeed: 0, uploadSpeed: 0};
    }

    const totalLength = this.engine.files.reduce(function (prevFileLength, currFile) {
      return prevFileLength + currFile.length;
    }, 0);
    const downloaded = this.engine.swarm.downloaded;
    const uploaded = this.engine.swarm.uploaded;
    const downloadSpeed = parseInt(this.engine.swarm.downloadSpeed(), 10);
    const uploadSpeed = parseInt(this.engine.swarm.uploadSpeed(), 10);

    const stats = {totalLength, downloaded, uploaded, downloadSpeed, uploadSpeed};
    return stats;
  };

  async destroy() {
    return new Promise(resolve => {
      if (this.engine) {
        logger.info('destroying torrent server');
        this.engine.server.destroy(() => {
          this.engine.destroy(resolve);
        });
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

type Stats = {
  totalLength: number,
  downloaded: number,
  uploaded: number,
  downloadSpeed: number,
  uploadSpeed: number
}
