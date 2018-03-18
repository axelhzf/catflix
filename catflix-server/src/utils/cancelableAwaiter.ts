import * as tslib from 'tslib';
import * as Bluebird from 'bluebird';
import * as awaiter from 'cancelable-awaiter';

declare var Promise: Bluebird<any>;

export function installCancelableAwaiter() {
  Bluebird.config({
    cancellation: true
  });

  (tslib as any).__awaiter = awaiter;
}
