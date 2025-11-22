import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { OverallHealthDto, ServiceHealthDto } from './dto/service-health.dto';

@ApiTags('Health Check')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Check health of all microservices
   */
  @Get('services')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check microservices health',
    description: 'Check connection and health status of all microservices',
  })
  @ApiResponse({
    status: 200,
    description: 'Health check completed',
    schema: {
      example: {
        status: 'healthy',
        services: [
          {
            service: 'Auth Service',
            status: 'up',
            message: 'Service is healthy',
            responseTime: 45,
            timestamp: '2025-11-05T21:00:00.000Z',
          },
        ],
        timestamp: '2025-11-05T21:00:00.000Z',
      },
    },
  })
  async checkServices(): Promise<OverallHealthDto> {
    return this.healthService.checkAllServices();
  }

  /**
   * Simple liveness probe
   */
  @Get('live')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Liveness probe',
    description: 'Check if API Gateway is running',
  })
  @ApiResponse({
    status: 200,
    description: 'API Gateway is alive',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2025-11-05T21:00:00.000Z',
      },
    },
  })
  async checkLiveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness probe
   */
  @Get('ready')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Readiness probe',
    description: 'Check if API Gateway is ready to serve requests',
  })
  @ApiResponse({
    status: 200,
    description: 'API Gateway is ready',
    schema: {
      example: {
        status: 'ready',
        timestamp: '2025-11-05T21:00:00.000Z',
      },
    },
  })
  async checkReadiness() {
    const health = await this.healthService.checkAllServices();

    if (health.status === 'unhealthy') {
      return {
        status: 'not-ready',
        message: 'Some critical services are down',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  }
}
