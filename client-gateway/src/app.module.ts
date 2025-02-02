import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PersonalDataModule } from './personal-data/personal-data.module';

@Module({
  imports: [AuthModule, UserModule, PersonalDataModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
