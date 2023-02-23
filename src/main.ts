import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger : process.env.NODE_ENV==='development'
    ? ['error','warn','log','verbose','debug'] 
    : ['error','warn']
  });
  await app.listen(3000);
}
bootstrap();
