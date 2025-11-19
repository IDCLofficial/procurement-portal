import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: (origin, callback) => {
       // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:5432',
        'http://localhost:8080',
        'http://localhost:5000',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:3002',
        'http://127.0.0.1:5432',
        'http://127.0.0.1:8080',
        'http://127.0.0.1:5000',
        'http://[::1]:3000',
        'http://[::1]:3001',
        'http://[::1]:3002',
        'http://[::1]:5432',
        'http://[::1]:8080',
        'http://[::1]:5000',
        'http://192.168.109.98:3000',
        'http://192.168.64.98:3000',
        'https://procurement-portal-2.onrender.com'
      ];

      // Allow ngrok URLs
      if (origin.includes('ngrok.io') || origin.includes('ngrok-free.app')) {
        return callback(null, true);
      }

      // Allow localhost origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // In development, allow all origins
      if (process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }

      // Reject other origins
      callback(new Error('Not allowed by CORS'));
    },
    
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'ngrok-skip-browser-warning',
    ],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('Procurement Portal API')
    .setDescription('API documentation for procurement bureau portal')
    .setVersion('1.0')
    .addTag('vendors', 'Vendor endpoints')
    .addTag('users', 'User management endpoints')
    .addBearerAuth() // optional: adds Authorization header
    .build();

  // Create the documentation
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 5000, '0.0.0.0');
  console.log(`Swagger documentation available at: ${await app.getUrl()}/api`);
}
bootstrap();
