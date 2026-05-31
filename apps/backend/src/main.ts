import { Reflector } from '@nestjs/core';

import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

app.useGlobalGuards(
  new JwtAuthGuard(reflector),
);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
