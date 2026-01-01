import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getConfig } from 'src/config';

@Module({
  imports: [
    // AuthService
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: getConfig().authService.urls,
          queue: getConfig().authService.queue,
          queueOptions: {
            durable: getConfig().authService.durable,
          },
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: getConfig().userService.urls,
          queue: getConfig().userService.queue,
          queueOptions: {
            durable: getConfig().userService.durable,
          },
        },
      },
      {
        name: 'FILE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: getConfig().fileService.urls,
          queue: getConfig().fileService.queue,
          queueOptions: {
            durable: getConfig().fileService.durable,
          },
        },
      },
      {
        name: 'ARTIST_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: getConfig().artistService.urls,
          queue: getConfig().artistService.queue,
          queueOptions: {
            durable: getConfig().artistService.durable,
          },
        },
      },
      {
        name: 'ALBUM_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: getConfig().albumService.urls,
          queue: getConfig().albumService.queue,
          queueOptions: {
            durable: getConfig().albumService.durable,
          },
        },
      },
      {
        name: 'SONG_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: getConfig().songService.urls,
          queue: getConfig().songService.queue,
          queueOptions: {
            durable: getConfig().songService.durable,
          },
        },
      },
      {
        name: 'PLAYLIST_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: getConfig().playlistService.urls,
          queue: getConfig().playlistService.queue,
          queueOptions: {
            durable: getConfig().playlistService.durable,
          },
        },
      },
      {
        name: 'STREAM_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: getConfig().streamService.urls,
          queue: getConfig().streamService.queue,
          queueOptions: {
            durable: getConfig().streamService.durable,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MicroserviceClientsModule {}
