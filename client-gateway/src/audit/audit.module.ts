import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { NatsModule } from '../transports/nats.module';

@Module({
  controllers: [AuditController],
  imports: [NatsModule],
})
export class AuditModule {}
