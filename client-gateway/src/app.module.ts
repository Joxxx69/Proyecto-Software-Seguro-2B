import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TransparencyModule } from './transparency/transparency.module';


@Module({
  imports: [AuthModule, UserModule, TransparencyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
