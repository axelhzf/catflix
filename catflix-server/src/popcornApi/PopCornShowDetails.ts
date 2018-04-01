export type PopCornShowDetailsTorrent = {
  provider: string;
  peers: number;
  seeds: number;
  url: string;
};

export type PopCornShowEpisodeTorrents = {
  '0'?: PopCornShowDetailsTorrent;
  '480p'?: PopCornShowDetailsTorrent;
  '720p'?: PopCornShowDetailsTorrent;
  '1080p'?: PopCornShowDetailsTorrent;
};

export type PopCornShowEpisodeWatched = {
  watched: boolean;
};

export type PopCornShowEpisode = {
  torrents: PopCornShowEpisodeTorrents;
  watched: PopCornShowEpisodeWatched;
  first_aired: number;
  date_based: boolean;
  overview: string;
  title: string;
  episode: number;
  season: number;
  tvdb_id: number;
};

export type PopCornShowDetailsImages = {
  poster: string;
  fanart: string;
  banner: string;
};

export type PopCornShowDetailsRating = {
  percentage: number;
  watching: number;
  votes: number;
  loved: number;
  hated: number;
};

export type PopCornShowDetails = {
  _id: string;
  imdb_id: string;
  tvdb_id: string;
  title: string;
  year: string;
  slug: string;
  synopsis: string;
  runtime: string;
  country: string;
  network: string;
  air_day: string;
  air_time: string;
  status: string;
  num_seasons: number;
  last_updated: number;
  __v: number;
  episodes: PopCornShowEpisode[];
  genres: string[];
  images: PopCornShowDetailsImages;
  rating: PopCornShowDetailsRating;
};
