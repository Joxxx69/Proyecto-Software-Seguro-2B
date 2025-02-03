import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuditModule } from './audit/audit.module';


@Module({
  imports: [AuthModule, UserModule, AuditModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
