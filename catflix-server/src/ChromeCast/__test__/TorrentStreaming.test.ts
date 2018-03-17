import { logger } from '../../logger';
import { TorrentStreaming } from '../TorrentStreaming';

async function main() {
  const magnet = 'magnet:?xt=urn:btih:3U25M2UCC3UTWZUHNYCQD5ZKTO6PW55M&dn=Utopia.1x01.HDTV.x264-FoV&tr=udp://tracker.openbittorrent.com:80/&tr=udp://open.demonii.com:80&tr=udp://tracker.coppersurfer.tk:80&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://exodus.desync.com:6969';

  const torrentStreaming = new TorrentStreaming();
  const response = await torrentStreaming.stream(magnet);

  logger.info(`file ${response.file.name} ${response.file.path} ${response.file.length}`);
  logger.info(`url ${response.url}`);

  setInterval(() => {
    const stats = torrentStreaming.getStats();
    logger.info(`stats:`, stats);
  }, 1000);
}

main().catch(e => logger.error(e));
