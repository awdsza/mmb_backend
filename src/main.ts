import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === 'production'
      ? '.production.env'
      : process.env.NODE_ENV === 'stage'
      ? '.stage.env'
      : '.development.env',
  ),
});
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
}
bootstrap();
