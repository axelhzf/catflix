import * as winston from 'winston';

winston.configure({
  transports: [
    new winston.transports.Console({
      timestamp: true,
      colorize: true
    })
  ]
});

export const logger = winston;
