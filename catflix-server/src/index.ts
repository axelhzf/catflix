import { config } from 'dotenv';
import * as graphqlHTTP from 'express-graphql';
import schema from './schema';
import { logger } from './logger';

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

const PORT = 4000;

app.listen(PORT, () => {
  logger.info(`Server running. Open http://localhost:${PORT}`);
});
