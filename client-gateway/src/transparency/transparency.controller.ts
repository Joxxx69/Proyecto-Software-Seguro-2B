import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { NATS_SERVICE } from '../config/services.config';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../auth/decorators';
import { CurrentUser } from '../auth/interfaces/current-user.interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enum/roles.enum';
import { PrivacyPolicyDto } from './dto/privacy-policy.dto';

@Controller('transparency')
export class TransparencyController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Get('privacy-policy/current')
  async getCurrentPrivacyPolicy() {
    try {
      return await firstValueFrom(
        this.client.send('get.current.privacy.policy', {})
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN_ROLE)
  @Post('privacy-policy')
  async updatePrivacyPolicy(@Body() updateDto: PrivacyPolicyDto) {
    try {
      return await firstValueFrom(
        this.client.send('update.privacy.policy', updateDto)
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('access-logs')
  async getAccessLogs(@User() user: CurrentUser) {
    try {
      return await firstValueFrom(
        this.client.send('get.access.logs', user.id)
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}