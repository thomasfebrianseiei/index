import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe,ValidationError } from '@nestjs/common';


const corsOrigins: string[] = [
  'http://localhost:5001',
  'http://localhost:3000',
  'http://10.10.28.1:5174',
  "https://fantek.id",
  // Add your production frontend URL here
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration
  app.enableCors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || corsOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
  });

  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');

  // Global pipes for validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
      whitelist: true
    }),
    new ValidateInputPipe()
  );

  // Security headers
  app.use(helmet());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Vallidge API')
    .setDescription('API Routes')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5000, () => {
    console.log('------------------------Listening on port 5000-----------------------------');
    
  });
}

bootstrap();