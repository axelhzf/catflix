import { installCancelableAwaiter } from '../cancelableAwaiter';

installCancelableAwaiter();

async function main() {
  while (1) {
    console.log('tick');
    await wait(100);
  }
}

async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const p = main();
setTimeout(() => {
  p.cancel();
}, 500);
