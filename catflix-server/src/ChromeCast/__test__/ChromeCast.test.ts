import { logger } from '../../logger';
import { ChromeCast } from '../ChromeCast';

async function loadVideo() {
  const chromeCast = new ChromeCast();
  await chromeCast.load({
    url: 'http://192.168.1.40:5000/Brooklyn.Nine-Nine.S05E11.720p.HDTV.x264-KILLERS[eztv].mkv',
    title: 'This is a test',
    device: 'Batcueva'
  });
  console.log('loaded');
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

loadVideo().catch(e => logger.error(e));
