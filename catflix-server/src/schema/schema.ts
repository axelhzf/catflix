/* tslint:disable */

export interface Query {
  movies?: Movie[] | null;
  movie?: Movie | null;
  shows?: Show[] | null;
  show?: Show | null;
  status?: Status | null;
  devices?: Device[] | null;
}

export interface Movie {
  id?: string | null;
  title: string;
  year: string;
  synopsis: string;
  trailer?: string | null;
  torrents?: Torrent[] | null;
  images?: Images | null;
}

export interface Torrent {
  lang?: string | null;
  quality: string;
  url?: string | null;
}

export interface Images {
  banner?: string | null;
  fanart?: string | null;
  poster?: string | null;
}

export interface Show {
  id?: string | null;
  title?: string | null;
  year?: string | null;
  numSeasons?: number | null;
  images?: Images | null;
  episodes?: Episode[] | null;
}

export interface Episode {
  id?: string | null;
  season?: number | null;
  episode?: number | null;
  title?: string | null;
  overview?: string | null;
  torrents?: Torrent[] | null;
}

export interface Status {
  filename: string;
  image?: string | null;
  server?: ServerStatus | null;
  chromecast?: ChromecastStatus | null;
  torrent?: TorrentStatus | null;
  device?: string | null;
}

export interface TorrentStatus {
  totalLength: number;
  downloaded: number;
  uploaded: number;
  downloadSpeed: number;
  uploadSpeed: number;
}

export interface Device {
  name: string;
  address: string;
  port: number;
}

export interface Mutation {
  playEpisode?: boolean | null;
  playMovie?: boolean | null;
  pause?: boolean | null;
  resume?: boolean | null;
  stop?: boolean | null;
}

export interface Subtitle {
  lang?: string | null;
  url?: string | null;
}
export interface MoviesQueryArgs {
  page?: number | null;
  sort?: SortOptions | null;
  order?: number | null;
  keywords?: string | null;
  genre?: string | null;
}
export interface MovieQueryArgs {
  id: string;
}
export interface ShowsQueryArgs {
  page?: number | null;
  sort?: SortOptions | null;
  order?: number | null;
  keywords?: string | null;
  genre?: string | null;
}
export interface ShowQueryArgs {
  id: string;
}
export interface EpisodesShowArgs {
  limit?: number | null;
}
export interface PlayEpisodeMutationArgs {
  showId: string;
  season: number;
  episode: number;
  quality?: string | null;
  subtitleLang?: string | null;
  device: string;
}
export interface PlayMovieMutationArgs {
  id: string;
  quality?: string | null;
  subtitleLang?: string | null;
  device: string;
}
export interface PauseMutationArgs {
  device: string;
}
export interface ResumeMutationArgs {
  device: string;
}
export interface StopMutationArgs {
  device: string;
}

export type SortOptions =
  | 'name'
  | 'rating'
  | 'released'
  | 'trending'
  | 'updated'
  | 'year';

export type ServerStatus =
  | 'IDLE'
  | 'DOWNLOADING_TORRENT'
  | 'DOWNLOADING_SUBTITLE'
  | 'LAUNCHING_CHROMECAST'
  | 'PLAYING'
  | 'PAUSED'
  | 'ERROR';

export type ChromecastStatus = 'IDLE' | 'BUFFERING' | 'PLAYING' | 'PAUSED';
