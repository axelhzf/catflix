import fetch from 'node-fetch';
import { promisify } from 'util';
import * as srt2vtt from 'srt2vtt';
import { v4 as internalIp } from 'internal-ip';
import * as http from 'http';
import { Server } from 'http';
import * as OS from 'opensubtitles-api';
import * as _ from 'lodash';
import * as iconv from 'iconv-lite';
import { logger } from '../logger';
import * as enableDestroy from 'server-destroy';

const srt2vtt2 = promisify(srt2vtt);

const SUBTITLES_PORT = 4101;

const OpenSubtitles = new OS({
  useragent: 'NodeOpensubtitles v0.0.1',
  username: process.env.OPEN_SUBTITLES_USERNAME,
  password: process.env.OPEN_SUBTITLES_PASSWORD,
  ssl: true
});

export class SubtitlesServer {
  private server: Server & { destroy?: (cb: () => void) => void } | undefined;

  async serve(fileName: string, length: number, lang: string) {
    logger.info('downloading subtitles for', fileName);
    const subtitle = await this.findSubtitle(fileName, length, lang);
    logger.info('subtitle found', subtitle);
    const subtitlesContent = await this.downloadSubtitle(subtitle);
    logger.info('subtitle downloaded');
    const vttSubtitles = await srt2vtt2(subtitlesContent);
    logger.info('subtitle converted to vtt');
    await this.destroy();
    await this.startServer(vttSubtitles, subtitle.encoding);
    const ip = await internalIp();
    const serverUrl = `http://${ip}:${this.server.address().port}`;
    logger.info('serving subtitle at', serverUrl);
    return serverUrl;
  }

  private startServer(vttSubtitles: any, encoding: string) {
    return new Promise(resolve => {
      this.server = http.createServer((req, res) => {
        logger.info('incoming subtitles request');
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Length': vttSubtitles.length,
          'Content-type': 'text/vtt;charset=utf-8'
        });
        enableDestroy(this.server);
        res.end(vttSubtitles);
      });
      this.server.listen(SUBTITLES_PORT, resolve);
    });
  }

  private async destroy() {
    return new Promise(resolve => {
      if (this.server && this.server.destroy)
        return this.server.destroy(resolve);
      resolve();
    });
  }

  private async findSubtitle(
    fileName: string,
    length: number,
    lang: string
  ): Promise<Subtitle | undefined> {
    // https://github.com/vankasteelj/opensubtitles-api#search-the-best-subtitles-in-all-languages-for-a-given-movieepisode
    const subtitles = await OpenSubtitles.search({
      sublanguageid: lang,
      filename: fileName,
      limit: 'best',
      filesize: length,
      gzip: false
    });
    const first = _.head(_.keys(subtitles));
    if (!first) return undefined;
    return subtitles[first] as Subtitle;
  }

  private async downloadSubtitle(subtitle: Subtitle): Promise<string> {
    const response = await fetch(subtitle.url);
    logger.info('fetching subtitles');
    const buffer = await response.buffer();
    logger.info('subtitles downloaded');
    const content = iconv.decode(buffer, subtitle.encoding);
    logger.info('decoding subtitles');
    return content;
  }
}

type Subtitle = {
  url: string;
  langcode: string;
  downloads: string;
  encoding: string;
  id: string;
  filename: string;
  score: number;
};
