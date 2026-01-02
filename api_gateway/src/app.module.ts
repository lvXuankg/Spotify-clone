import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MicroserviceClientsModule } from './microservice-clients/microservice-clients.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './common/logger/logger.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { SongModule } from './song/song.module';
import { PlaylistModule } from './playlist/playlist.module';
import { StreamModule } from './stream/stream.module';
import { SearchModule } from './search/search.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule,
    MicroserviceClientsModule,
    AuthModule,
    LoggerModule,
    HealthModule,
    UserModule,
    FileModule,
    ArtistModule,
    AlbumModule,
    SongModule,
    PlaylistModule,
    StreamModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
