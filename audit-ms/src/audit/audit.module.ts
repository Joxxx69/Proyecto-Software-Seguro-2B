import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [AuditController],
  providers: [AuditService],
  imports:[NatsModule]
})
export class AuditModule {}
