import { Module } from '@nestjs/common';
import { PersonalDataController } from './personal-data.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [PersonalDataController],
  imports: [NatsModule]
})
export class PersonalDataModule {}
