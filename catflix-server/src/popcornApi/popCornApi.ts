import { PopCornMovie } from './PopCornMovie';
import { PopCornShow } from './PopCornShow';
import { PopCornShowDetails } from './PopCornShowDetails';
import { logger } from '../logger';
import axios, { AxiosResponse } from 'axios';
import { MoviesQueryArgs, ShowsQueryArgs } from '../schema/schema';
import * as _ from 'lodash';

export class PopcornApi {
  async getMovies(args: MoviesQueryArgs): Promise<PopCornMovie[]> {
    logger.info(`getMovies`, args);
    args = _.defaults(args, { page: 1, sort: 'trending' } as MoviesQueryArgs);
    const { page, ...params } = args;
    const url = `https://api-fetch.website/tv/movies/${page}`;
    const response: AxiosResponse<PopCornMovie[]> = await axios({
      method: 'get',
      url,
      params
    });
    return response.data;
  }

  async getMovie(id: string): Promise<PopCornMovie> {
    logger.info(`getMovie ${id}`);
    const response = await axios.get(
      `https://api-fetch.website/tv/movie/${id}`
    );
    return response.data;
  }

  async getShows(args: ShowsQueryArgs): Promise<PopCornShow[]> {
    logger.info(`getShows`, args);
    args = _.defaults(args, { page: 1, sort: 'trending' } as ShowsQueryArgs);
    const { page, ...params } = args;
    const url = `https://api-fetch.website/tv/shows/${page}`;
    const response: AxiosResponse<PopCornShow[]> = await axios({
      method: 'get',
      url,
      params
    });
    return response.data;
  }

  async getShow(id: string): Promise<PopCornShowDetails> {
    logger.info(`getShow ${id}`);
    const response = await axios.get(`https://api-fetch.website/tv/show/${id}`);
    return response.data;
  }
}

export const popcornApi = new PopcornApi();
