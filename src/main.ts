import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  //app.enableCors();
  app.enableCors({
    origin: [
      "http://localhost:3000",       // local Next.js
      "http://192.168.10.50:3000",
      "https://bkash-p2p-frontend.onrender.com"
    ], // your Next.js frontend URL
    credentials: true, // ✅ allow sending cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  await app.listen(process.env.PORT ?? 1000);
}
bootstrap();
