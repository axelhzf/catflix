import * as DLNACasts from 'dlnacasts';
import {logger} from "../logger";

export class DLNA {

  async load(args: PlayArgs) {
    logger.info('dlna load', args);
    const player: any = await this.getPlayer();
    logger.info('dlna get player');
    player.play(args.url, {
      title: args.title,
      type: 'video/mp4',
      subtitles: [args.subtitlesUrl]
    });
    logger.info('dlna play');
  }

  private getPlayer() {
    return new Promise((resolve) => {
      const cast = DLNACasts();
      cast.on('update', function (player) {
        logger.info('update!');
        resolve(player);
      });
      cast.update();
    })
  }

}

type PlayArgs = {
  url: string;
  subtitlesUrl?: string;
  title?: string;
  imageUrl?: string;
  device?: string;
};
