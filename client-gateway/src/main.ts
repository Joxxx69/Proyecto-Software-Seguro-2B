import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs.config';
import { RpcCustomExceptionFilter } from './common/expections/rpc-custom-exception.expection';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new RpcCustomExceptionFilter())

  app.setGlobalPrefix('api')
  app.use(cookieParser());

  await app.listen(envs.PORT);
}
bootstrap();
