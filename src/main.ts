import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { GlobalResponseInterceptor } from './common/interceptors/global-response/global-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });

  // Set global prefix
  app.setGlobalPrefix('api');

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') ?? 3000;
  const env = configService.get<string>('env') ?? 'development';
  const allowedOrigins = configService.get<string[]>('cors.allowedOrigins') ?? [];

  // Enable CORS with whitelisting from config
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Logging
  app.use(morgan('dev'));

  // Cookie parser
  app.use(cookieParser());

  // Body parsing limits (standard NestJS way via underlying express)
  app.useBodyParser('json', { limit: '5mb' });
  app.useBodyParser('urlencoded', { extended: false, limit: '5mb' });

  // Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Automatically convert types
      },
    }),
  );

  // Apply global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Apply global response interceptor
  app.useGlobalInterceptors(new GlobalResponseInterceptor());

  // Enable Swagger (development, local, and production for initial testing)
  if (env === 'development' || env === 'local' || env === 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Islamic App API')
      .setDescription('API documentation for Islamic App Backend')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('islamic-app')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);

    console.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
  }

  await app.listen(port, () => {
    console.log(`Application is running on: http://localhost:${port}`);
  });
}
void bootstrap();
