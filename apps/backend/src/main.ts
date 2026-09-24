import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'https://logistics-bill-kro.vercel.app',
      'https://logistics-bill-4iu3gttn9-team-billkro.vercel.app',
    ],
    credentials: true,
  });

  const reflector = app.get(Reflector);

  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();