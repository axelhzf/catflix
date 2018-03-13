export type MediaId = MovieId | EpisodeId;

type MovieId = {
  type: 'movie';
  imdbid: string;
}

type EpisodeId = {
  type: 'episode';
  imdbid: string;
  season: number;
  episode: number;
}