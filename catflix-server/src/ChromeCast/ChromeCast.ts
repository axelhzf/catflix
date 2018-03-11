import { Client, DefaultMediaReceiver } from 'castv2-client';
import * as mdns from 'mdns';
import { logger } from '../logger';
import { promisifyAll } from 'bluebird';
import * as _ from 'lodash';
import { ChromecastStatus } from '../schema/schema';

mdns.Browser.defaultResolverSequence[1] =
  'DNSServiceGetAddrInfo' in mdns.dns_sd
    ? mdns.rst.DNSServiceGetAddrInfo()
    : mdns.rst.getaddrinfo({ families: [4] }); //fix for Raspberry Pi's mdns browser https://github.com/agnat/node_mdns/issues/130

export class ChromeCast {
  device: Device | undefined;
  client: any | undefined;
  player: any | undefined;
  playerState: ChromecastStatus = 'IDLE';

  private async init(deviceName?: string) {
    const devices = await ChromeCast.searchDevices();
    if (devices.length === 0) throw new Error('No devices found');
    if (deviceName === undefined) {
      this.device = devices[0];
    } else {
      const device = _.find(devices, device => device.name === deviceName);
      if (!device) throw new Error(`Device with name ${deviceName} not found`);
      this.device = device;
    }

    this.client = new Client();
    promisifyAll(this.client);

    logger.info('connecting to device', this.device.name);
    await this.client.connectAsync(this.device.address);
    this.client.on('error', e => {
      console.error(e);
      this.client = undefined;
      this.player = undefined;
    });
    logger.info('connected to client');
    logger.info('launching player');
    const status = await this.client.getStatusAsync();
    logger.info('client status', status);
    const sessions = await this.client.getSessionsAsync();
    logger.info(`sessions `, sessions);

    const application = _.find(
      status.applications,
      app => app.appId === DefaultMediaReceiver.APP_ID
    );
    if (application) {
      this.player = await this.client.joinAsync(
        application,
        DefaultMediaReceiver
      );
    } else {
      this.player = await this.client.launchAsync(DefaultMediaReceiver);
    }
    promisifyAll(this.player);
    this.player.on('status', this.onStatus);
    const playerStatus = await this.player.getStatusAsync();
    logger.info('player status', playerStatus);

    this.player.on('error', e => {
      logger.error('player error', e);
      this.client = undefined;
      this.player = undefined;
    });
  }

  static async searchDevices() {
    const devices = await new Promise<Device[]>(resolve => {
      logger.info('searching for devices');
      const devices: Device[] = [];
      const browser = mdns.createBrowser(mdns.tcp('googlecast'));
      browser.on('serviceUp', service => {
        const device: Device = {
          name: service.txtRecord.fn,
          address: service.addresses[0],
          port: service.port
        };
        logger.info('device found', device);
        devices.push(device);
      });
      browser.start();
      setTimeout(() => {
        browser.stop();
        logger.info('devices found', devices);
        resolve(devices);
      }, 1500);
    });
    return devices;
  }

  private onStatus = status => {
    const playerState = status.playerState;
    this.playerState = playerState;
    logger.info('player status', this.playerState);
  };

  getDeviceName() {
    return this.device ? this.device.name : undefined;
  }

  async load(args: PlayArgs) {
    const loadingInOtherDevice = args.device && args.device !== this.getDeviceName();
    if (!this.player || loadingInOtherDevice) {
      await this.init(args.device);
    }
    const media = this.getMedia(args);
    logger.info('loading player', JSON.stringify(media));
    const status = await this.player.loadAsync(media, {
      autoplay: true,
      activeTrackIds: args.subtitlesUrl ? [1] : undefined
    });
    logger.info('player loaded');
    return status;
  }

  async pause() {
    if (!this.player) {
      await this.init();
    }
    await this.player.pauseAsync();
  }

  async play() {
    if (!this.player) {
      await this.init();
    }
    await this.player.playAsync();
  }

  async stop() {
    if (!this.player) {
      await this.init();
    }
    await this.player.stopAsync();
  }

  private getMedia(args: PlayArgs) {
    const media: any = {
      contentId: args.url,
      contentType: 'video/mp4',
      streamType: 'BUFFERED', // or LIVE
      metadata: {
        type: 0,
        metadataType: 0,
        title: args.title ? args.title : 'No title',
        images: []
      }
    };

    if (args.subtitlesUrl) {
      media.tracks = [
        {
          trackId: 1,
          type: 'TEXT',
          trackContentId: args.subtitlesUrl,
          trackContentType: 'text/vtt',
          name: 'English',
          language: 'en-US',
          subtype: 'SUBTITLES'
        }
      ];
      media.textTrackStyle = {
        backgroundColor: '#00000000',
        foregroundColor: '#FFFF00FF',
        edgeType: 'OUTLINE',
        edgeColor: '#000000FF',
        fontScale: 1,
        fontStyle: 'NORMAL',
        fontFamily: 'Droid Sans',
        fontGenericFamily: 'SANS_SERIF',
        windowColor: '#AA00FFFF',
        windowRoundedCornerRadius: 10,
        windowType: 'NONE'
      };
    }

    if (args.imageUrl) {
      media.metadata.images.push({ url: args.imageUrl });
    }
    return media;
  }
}

type PlayArgs = {
  url: string;
  subtitlesUrl?: string;
  title?: string;
  imageUrl?: string;
  device?: string;
};

type Device = {
  name: string;
  address: string;
  port: number;
};
