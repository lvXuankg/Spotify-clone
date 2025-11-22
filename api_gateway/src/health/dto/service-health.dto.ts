/**
 * Service Health Check Response DTO
 */
export class ServiceHealthDto {
  service: string;
  status: 'up' | 'down';
  message: string;
  responseTime: number; // milliseconds
  timestamp: string;
}

export class OverallHealthDto {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: ServiceHealthDto[];
  timestamp: string;
}
