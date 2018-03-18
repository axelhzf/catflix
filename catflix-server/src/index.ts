import { config } from 'dotenv';
import * as graphqlHTTP from 'express-graphql';
import schema from './schema';
import { logger } from './logger';
import * as mdns from 'mdns';
import { installCancelableAwaiter } from './utils/cancelableAwaiter';

installCancelableAwaiter();

const PORT = 4000;

config();

const express = require('express');

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(PORT, () => {
  logger.info(`Server running. Open http://localhost:${PORT}`);
  const ad = mdns.createAdvertisement(mdns.tcp('catflix'), PORT);
  ad.start();
});
