import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConsentModule } from './consent/consent.module';


@Module({
  imports: [AuthModule, UserModule, ConsentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
