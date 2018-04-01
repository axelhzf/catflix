import * as _ from 'lodash';
import { moviesResolver } from './moviesResolver';
import { showsResolver } from './showsResolver';
import { playerResolver } from './playerResolver';

export const rootResolver = _.merge(
  {},
  moviesResolver,
  showsResolver,
  playerResolver
);
