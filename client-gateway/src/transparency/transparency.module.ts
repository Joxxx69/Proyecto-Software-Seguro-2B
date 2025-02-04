import { Module } from '@nestjs/common';
import { TransparencyController } from './transparency.controller';
import { NatsModule } from '../transports/nats.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TransparencyController],
  imports: [NatsModule, AuthModule]
})
export class TransparencyModule {}