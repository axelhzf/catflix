export type PopCornShowImages = {
  poster: string;
  fanart: string;
  banner: string;
};

export type PopCornShowRating = {
  percentage: number;
  watching: number;
  votes: number;
  loved: number;
  hated: number;
};

export type PopCornShow = {
  _id: string;
  imdb_id: string;
  tvdb_id: string;
  title: string;
  year: string;
  slug: string;
  num_seasons: number;
  images: PopCornShowImages;
  rating: PopCornShowRating;
};
