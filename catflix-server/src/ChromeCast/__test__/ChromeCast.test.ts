import { logger } from '../../logger';
import { ChromeCast } from '../ChromeCast';

async function main() {
  const chromeCast = new ChromeCast();
  await chromeCast.load({
    url: 'http://localhost:4102',
    title: 'This is a test',
    device: 'Batcueva 2.0'
  });
  console.log('loaded');
}

main().catch(e => logger.error(e));
