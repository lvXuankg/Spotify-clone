import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('MyApp API Gateway')
    .setDescription('API documentation for MyApp microservices')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'access-token', // tên key cho auth
    )
    .addServer('http://localhost:3000', 'Local development')
    .addServer('https://api.myapp.com', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // giữ lại token khi reload trang
      docExpansion: 'none', // collapse tất cả
      filter: true, // có ô search
      operationsSorter: 'alpha', // sắp xếp alphabet
    },
    customSiteTitle: 'MyApp API Docs',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
  });
}
