import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NatsModule } from '../transports/nats.module';
import { PersonalDataService } from '../personal-data/personal-data.service';

@Module({
  imports: [PrismaModule, NatsModule], // Importamos PrismaModule y NatsModule
  controllers: [AuditController],
  providers: [AuditService, PersonalDataService],
})
export class AuditModule {}

