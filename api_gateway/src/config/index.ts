export { getCorsConfig } from './cors.config';

export interface AppConfig {
  authService: AuthRabbitMQ;
  userService: UserRabbitMQ;
  fileService: FileRabbitMQ;
  artistService: ArtistRabbitMQ;
  albumService: AlbumRabbitMQ;
  songService: SongRabbitMQ;
  playlistService: PlaylistRabbitMQ;
  streamService: StreamRabbitMQ;
  searchService: SearchRabbitMQ;
  http: HttpConfig;
}

export interface AuthRabbitMQ {
  urls: string[];
  queue: string;
  durable: boolean;
}

export interface UserRabbitMQ {
  urls: string[];
  queue: string;
  durable: boolean;
}

export interface ArtistRabbitMQ {
  urls: string[];
  queue: string;
  durable: boolean;
}

export interface FileRabbitMQ {
  urls: string[];
  queue: string;
  durable: boolean;
}

export interface AlbumRabbitMQ {
  urls: string[];
  queue: string;
  durable: boolean;
}

export interface SongRabbitMQ {
  urls: string[];
  queue: string;
  durable: boolean;
}

export interface PlaylistRabbitMQ {
  urls: string[];
  queue: string;
  durable: boolean;
}

export interface StreamRabbitMQ {
  urls: string[];
  queue: string;
  durable: boolean;
}

export interface SearchRabbitMQ {
  urls: string[];
  queue: string;
  durable: boolean;
}

export interface HttpConfig {
  port: number;
  prefix: string;
  baseUrl: string;
  nodeEnv: string;
}

export const getConfig = (): AppConfig => ({
  authService: {
    urls: [
      process.env.AUTH_SERVICE_RABBITMQ_URL ||
        'amqp://admin:1234@localhost:5672',
    ],
    queue: process.env.AUTH_SERVICE_RABBITMQ_QUEUE || 'auth_queue',
    durable: process.env.AUTH_SERVICE_RABBITMQ_OPTION_DURABLE === 'true',
  },
  userService: {
    urls: [
      process.env.USER_SERVICE_RABBITMQ_URL ||
        'amqp://admin:1234@localhost:5672',
    ],
    queue: process.env.USER_SERVICE_RABBITMQ_QUEUE || 'auth_queue',
    durable: process.env.USER_SERVICE_RABBITMQ_OPTION_DURABLE === 'true',
  },
  fileService: {
    urls: [
      process.env.FILE_SERVICE_RABBITMQ_URL ||
        'amqp://admin:1234@localhost:5672',
    ],
    queue: process.env.FILE_SERVICE_RABBITMQ_QUEUE || 'file_queue',
    durable: process.env.FILE_SERVICE_RABBITMQ_OPTION_DURABLE === 'true',
  },
  artistService: {
    urls: [
      process.env.ARTIST_SERVICE_RABBITMQ_URL ||
        'amqp://admin:1234@localhost:5672',
    ],
    queue: process.env.ARTIST_SERVICE_RABBITMQ_QUEUE || 'artist_queue',
    durable: process.env.ARTIST_SERVICE_RABBITMQ_OPTION_DURABLE === 'true',
  },
  albumService: {
    urls: [
      process.env.ALBUM_SERVICE_RABBITMQ_URL ||
        'amqp://admin:1234@localhost:5672',
    ],
    queue: process.env.ALBUM_SERVICE_RABBITMQ_QUEUE || 'album_queue',
    durable: process.env.ALBUM_SERVICE_RABBITMQ_OPTION_DURABLE === 'true',
  },
  songService: {
    urls: [
      process.env.SONG_SERVICE_RABBITMQ_URL ||
        'amqp://admin:1234@localhost:5672',
    ],
    queue: process.env.SONG_SERVICE_RABBITMQ_QUEUE || 'song_queue',
    durable: process.env.SONG_SERVICE_RABBITMQ_OPTION_DURABLE === 'true',
  },
  playlistService: {
    urls: [
      process.env.PLAYLIST_SERVICE_RABBITMQ_URL ||
        'amqp://admin:1234@localhost:5672',
    ],
    queue: process.env.PLAYLIST_SERVICE_RABBITMQ_QUEUE || 'playlist_queue',
    durable: process.env.PLAYLIST_SERVICE_RABBITMQ_OPTION_DURABLE === 'true',
  },
  streamService: {
    urls: [
      process.env.STREAM_SERVICE_RABBITMQ_URL ||
        'amqp://admin:1234@localhost:5672',
    ],
    queue: process.env.STREAM_SERVICE_RABBITMQ_QUEUE || 'stream_queue',
    durable: process.env.STREAM_SERVICE_RABBITMQ_OPTION_DURABLE === 'true',
  },
  searchService: {
    urls: [
      process.env.SEARCH_SERVICE_RABBITMQ_URL ||
        'amqp://admin:1234@localhost:5672',
    ],
    queue: process.env.SEARCH_SERVICE_RABBITMQ_QUEUE || 'search_queue',
    durable: process.env.SEARCH_SERVICE_RABBITMQ_OPTION_DURABLE !== 'false',
  },
  http: {
    port: parseInt(process.env.PORT || '8080', 10),
    prefix: process.env.GLOBAL_PREFIX || '',
    baseUrl: process.env.PREFIX_BACKEND_URL || 'http://localhost',
    nodeEnv: process.env.NODE_ENV || 'develope',
  },
});
