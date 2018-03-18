import { logger } from '../../logger';
import { ChromeCast } from '../ChromeCast';

async function loadVideo() {
  const chromeCast = new ChromeCast();
  await chromeCast.load({
    url: 'http://localhost:4102',
    title: 'This is a test',
    device: 'Batcueva 2.0'
  });
  console.log('loaded');
}

async function showMessage() {
  const chromeCast = new ChromeCast();
  await chromeCast.showMessage({
    message: 'This is a test',
    device: 'Batcueva 2.0'
  });
  await wait(1000);
  await chromeCast.showMessage({
    message: 'This is a test 2',
    device: 'Batcueva 2.0'
  });
  await wait(1000);
  await chromeCast.showMessage({
    message: 'This is a test 3',
    device: 'Batcueva 2.0'
  });
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

showMessage().catch(e => logger.error(e));
