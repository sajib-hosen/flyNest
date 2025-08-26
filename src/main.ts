import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({}));

  app.use(cookieParser());

  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );

  // client base urls
  const whitelist = ['http://localhost:3001/'];
  app.enableCors({
    origin: whitelist,
    credentials: true,
  });

  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('NetFly')
    .setDescription('The NetFly API Specification')
    .setVersion('1.0.0')
    .addBearerAuth({
      description:
        'Please enter cookie in the following format: Bearer <JWT> or pass the cookie in the request header',
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document, {
    yamlDocumentUrl:
      process.env.NODE_ENV === 'production' ? undefined : '/swagger.yaml',
  });

  await app.listen(port ?? 3000);
}

bootstrap();
