export interface AppConfig {
  rabbitmq: RabbitMQConfig;
  http: HttpConfig;
  system: SystemConfig;
}

export interface RabbitMQConfig {
  urls: string[];
  queue: string;
  durable: boolean;
}

export interface HttpConfig {
  port: number;
  prefix: string;
  baseUrl: string;
}

export interface SystemConfig {
  roleCanFinds: string[];
  quantityUserResponse: number;
}

export const getConfig = (): AppConfig => ({
  rabbitmq: {
    urls: [process.env.RABBITMQ_URL || 'amqp://admin:1234@localhost:5672'],
    queue: process.env.RABBITMQ_QUEUE || 'auth_queue',
    durable: process.env.RABBITMQ_OPTION_DURABLE === 'true',
  },
  http: {
    port: parseInt(process.env.HEALTH_CHECK_PORT || '3001', 10),
    prefix: process.env.GLOBAL_PREFIX || 'user',
    baseUrl: process.env.PREFIX_BACKEND_URL || 'http://localhost',
  },
  system: {
    roleCanFinds: ['member', 'memberVip'],
    quantityUserResponse: 15,
  },
});
