import fetch from 'node-fetch';
import { PopCornMovie } from './PopCornMovie';
import { PopCornShow } from './PopCornShow';
import { PopCornShowDetails } from './PopCornShowDetails';
import { logger } from '../logger';

export class PopCornApi {
  async getMovies(page: number = 1): Promise<PopCornMovie[]> {
    logger.info(`getMovies ${page}`);
    const response = await fetch(
      `https://api-fetch.website/tv/movies/${page}?sort=trending`
    );
    return await response.json();
  }

  async getMovie(id: string): Promise<PopCornMovie> {
    logger.info(`getMovie ${id}`);
    const response = await fetch(`https://api-fetch.website/tv/movie/${id}`);
    return await response.json();
  }

  async getShows(page: number = 1): Promise<PopCornShow[]> {
    logger.info(`getShows ${page}`);
    const response = await fetch(
      `https://api-fetch.website/tv/shows/${page || 1}`
    );
    return await response.json();
  }

  async getShow(id: string): Promise<PopCornShowDetails> {
    logger.info(`getShow ${id}`);
    const response = await fetch(`https://api-fetch.website/tv/show/${id}`);
    return await response.json();
  }
}
