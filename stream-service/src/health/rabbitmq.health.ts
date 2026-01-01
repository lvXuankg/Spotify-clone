import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import * as amqp from 'amqplib';
import { getConfig } from 'src/config';

@Injectable()
export class RabbitMQHealthIndicator {
  constructor(private healthIndicatorService: HealthIndicatorService) {}

  private readonly rabbitUrl = Array.isArray(getConfig().rabbitmq.urls)
    ? getConfig().rabbitmq.urls[0]
    : getConfig().rabbitmq.urls;

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);
    try {
      const connection = await amqp.connect(this.rabbitUrl);
      await connection.close();
      return indicator.up();
    } catch (error) {
      return indicator.down('RabbitMQ is not fine');
    }
  }
}
