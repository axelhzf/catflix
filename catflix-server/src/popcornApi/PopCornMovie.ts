export type PopCornMovieTorrent = {
  provider: string;
  filesize: string;
  size: any;
  peer: number;
  seed: number;
  url: string;
};

export type PopCornMovieTorrentQuality = {
  '1080p'?: PopCornMovieTorrent;
  '720p'?: PopCornMovieTorrent;
};

export type PopCornMovieTorrents = {
  [key: string]: PopCornMovieTorrentQuality;
};

export type PopCornMovieImages = {
  poster: string;
  fanart: string;
  banner: string;
};

export type PopCornMovieRating = {
  percentage: number;
  watching: number;
  votes: number;
  loved: number;
  hated: number;
};

export type PopCornMovie = {
  _id: string;
  imdb_id: string;
  title: string;
  year: string;
  synopsis: string;
  runtime: string;
  released: number;
  trailer: string;
  certification: string;
  torrents: PopCornMovieTorrents;
  genres: string[];
  images: PopCornMovieImages;
  rating: PopCornMovieRating;
};
