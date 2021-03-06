/* tslint:disable */
//  This file was automatically generated and should not be edited.

export enum ServerStatus {
  IDLE = "IDLE",
  DOWNLOADING_TORRENT = "DOWNLOADING_TORRENT",
  DOWNLOADING_SUBTITLE = "DOWNLOADING_SUBTITLE",
  LAUNCHING_CHROMECAST = "LAUNCHING_CHROMECAST",
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  ERROR = "ERROR",
}


export enum ChromecastStatus {
  IDLE = "IDLE",
  BUFFERING = "BUFFERING",
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
}


export type PlayerBarQuery = {
  status:  {
    filename: string,
    image: string | null,
    server: ServerStatus | null,
    chromecast: ChromecastStatus | null,
    device: string | null,
    torrent:  {
      downloadSpeed: number,
      downloaded: number,
      totalLength: number,
    } | null,
  } | null,
};

export type PlayerBarResumeMutationVariables = {
  device: string,
};

export type PlayerBarResumeMutation = {
  resume: boolean | null,
};

export type PlayerBarPauseMutationVariables = {
  device: string,
};

export type PlayerBarPauseMutation = {
  pause: boolean | null,
};

export type PlayerBarStopMutationVariables = {
  device: string,
};

export type PlayerBarStopMutation = {
  stop: boolean | null,
};

export type MoviesQueryVariables = {
  keywords?: string | null,
};

export type MoviesQuery = {
  movies:  Array< {
    id: string | null,
    title: string,
    synopsis: string,
    images:  {
      banner: string | null,
      fanart: string | null,
      poster: string | null,
    } | null,
  } | null > | null,
};

export type playMovieMutationVariables = {
  id: string,
  quality?: string | null,
  subtitleLang?: string | null,
  device: string,
};

export type playMovieMutation = {
  playMovie: boolean | null,
};

export type DevicesQuery = {
  devices:  Array< {
    name: string,
  } | null > | null,
};

export type ShowQueryVariables = {
  showId: string,
};

export type ShowQuery = {
  show:  {
    id: string | null,
    title: string | null,
    episodes:  Array< {
      id: string | null,
      title: string | null,
      season: number | null,
      episode: number | null,
      torrents:  Array< {
        quality: string,
        url: string | null,
      } | null > | null,
    } | null > | null,
  } | null,
};

export type playEpisodeMutationVariables = {
  showId: string,
  season: number,
  episode: number,
  quality?: string | null,
  subtitleLang?: string | null,
  device: string,
};

export type playEpisodeMutation = {
  playEpisode: boolean | null,
};

export type ShowsQueryVariables = {
  keywords?: string | null,
};

export type ShowsQuery = {
  shows:  Array< {
    id: string | null,
    title: string | null,
    images:  {
      poster: string | null,
    } | null,
  } | null > | null,
};
