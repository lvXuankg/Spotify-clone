export interface AppConfig {
  authService: AuthRabbitMQ;
  userService: UserRabbitMQ;
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
  http: {
    port: parseInt(process.env.PORT || '8080', 10),
    prefix: process.env.GLOBAL_PREFIX || '',
    baseUrl: process.env.PREFIX_BACKEND_URL || 'http://localhost',
    nodeEnv: process.env.NODE_ENV || 'develope',
  },
});
