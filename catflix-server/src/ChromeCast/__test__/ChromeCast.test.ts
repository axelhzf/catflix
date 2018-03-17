import { logger } from '../../logger';
import { ChromeCast } from '../ChromeCast';

async function main() {
  const chromeCast = new ChromeCast();
  await chromeCast.load({
    url: 'https://www.quirksmode.org/html5/videos/big_buck_bunny.mp4',
    title: 'This is a test',
    device: 'Batcueva 2.0'
  });
  console.log('loaded');
}

main().catch(e => logger.error(e));