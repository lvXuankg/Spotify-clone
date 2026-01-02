import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ServiceHealthDto, OverallHealthDto } from './dto/service-health.dto';
import { LoggerService } from '../common/logger/logger.service';

@Injectable()
export class HealthService {
  constructor(
    @Inject('AUTH_SERVICE') private authServiceClient: ClientProxy,
    @Inject('USER_SERVICE') private userServiceClient: ClientProxy,
    @Inject('FILE_SERVICE') private fileServiceClient: ClientProxy,
    @Inject('ARTIST_SERVICE') private artistServiceClient: ClientProxy,
    @Inject('ALBUM_SERVICE') private albumServiceClient: ClientProxy,
    @Inject('SONG_SERVICE') private songServiceClient: ClientProxy,
    @Inject('PLAYLIST_SERVICE') private playlistServiceClient: ClientProxy,
    @Inject('STREAM_SERVICE') private streamServiceClient: ClientProxy,
    @Inject('SEARCH_SERVICE') private searchServiceClient: ClientProxy,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Check health of a specific microservice
   */
  private async checkServiceHealth(
    serviceName: string,
    client: ClientProxy,
  ): Promise<ServiceHealthDto> {
    const startTime = Date.now();

    try {
      // Send ping message pattern with 5 second timeout
      await client
        .send('health.ping', {})
        .pipe(
          timeout(5000),
          catchError((error) => {
            throw new Error(`Service unavailable: ${error.message}`);
          }),
        )
        .toPromise();

      const responseTime = Date.now() - startTime;

      return {
        service: serviceName,
        status: 'up',
        message: 'Service is healthy',
        responseTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      this.logger.error(
        `Health check failed for ${serviceName}: ${error.message}`,
      );

      return {
        service: serviceName,
        status: 'down',
        message: error.message || 'Service is unavailable',
        responseTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Check health of all services
   */
  async checkAllServices(): Promise<OverallHealthDto> {
    const services: ServiceHealthDto[] = [];

    // Check Auth Service
    const authServiceHealth = await this.checkServiceHealth(
      'Auth Service',
      this.authServiceClient,
    );
    services.push(authServiceHealth);

    // Check User Service
    const userServiceHealth = await this.checkServiceHealth(
      'User Service',
      this.userServiceClient,
    );
    services.push(userServiceHealth);

    // Check File Service
    const fileServiceHealth = await this.checkServiceHealth(
      'File Service',
      this.fileServiceClient,
    );
    services.push(fileServiceHealth);

    // Check Artist Service
    const artistServiceHealth = await this.checkServiceHealth(
      'Artist Service',
      this.artistServiceClient,
    );
    services.push(artistServiceHealth);

    // Check Album Service
    const albumServiceHealth = await this.checkServiceHealth(
      'Album Service',
      this.albumServiceClient,
    );
    services.push(albumServiceHealth);

    // Check Song Service
    const songServiceHealth = await this.checkServiceHealth(
      'Song Service',
      this.songServiceClient,
    );
    services.push(songServiceHealth);

    // Check Playlist Service
    const playlistServiceHealth = await this.checkServiceHealth(
      'Playlist Service',
      this.playlistServiceClient,
    );
    services.push(playlistServiceHealth);

    // Check Stream Service
    const streamServiceHealth = await this.checkServiceHealth(
      'Stream Service',
      this.streamServiceClient,
    );
    services.push(streamServiceHealth);

    // Check Search Service
    const searchServiceHealth = await this.checkServiceHealth(
      'Search Service',
      this.searchServiceClient,
    );
    services.push(searchServiceHealth);

    // Determine overall status
    const allHealthy = services.every((s) => s.status === 'up');
    const anyUp = services.some((s) => s.status === 'up');

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    if (allHealthy) {
      overallStatus = 'healthy';
    } else if (anyUp) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'unhealthy';
    }

    return {
      status: overallStatus,
      services,
      timestamp: new Date().toISOString(),
    };
  }
}
