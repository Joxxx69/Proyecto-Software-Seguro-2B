import { Controller, Get, Post, Body, UseGuards, Param, Query, Patch } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { NATS_SERVICE } from '../config/services.config';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../auth/decorators';
import { CurrentUser } from '../auth/interfaces/current-user.interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enum/roles.enum';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdatePrivacyPolicyDto } from './dto/update-privacy-policy.dto';
import { RequestTransparencyDto } from './dto/request-transparency.dto';

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
  async updatePrivacyPolicy(@Body() updateDto: UpdatePrivacyPolicyDto) {
    try {
      return await firstValueFrom(
        this.client.send('update.privacy.policy', updateDto)
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('my-data')
  async getMyTransparencyData(@User() user: CurrentUser) {
    try {
      return await firstValueFrom(
        this.client.send('get.transparency.data', user.id)
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Post('notifications')
  async createNotification(
    @Body() createDto: CreateNotificationDto,
    @User() user: CurrentUser
  ) {
    try {
      createDto['titularId'] = user.id;
      return await firstValueFrom(
        this.client.send('create.transparency.notification', createDto)
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('notifications')
  async getMyNotifications(@User() user: CurrentUser) {
    try {
      return await firstValueFrom(
        this.client.send('get.user.notifications', user.id)
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('notifications/:id/read')
  async markNotificationAsRead(
    @Param('id') notificationId: string,
    @User() user: CurrentUser
  ) {
    try {
      return await firstValueFrom(
        this.client.send('mark.notification.read', {
          notificationId,
          userId: user.id
        })
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Post('requests')
  async createTransparencyRequest(
    @Body() requestDto: RequestTransparencyDto,
    @User() user: CurrentUser
  ) {
    try {
      return await firstValueFrom(
        this.client.send('create.transparency.request', {
          ...requestDto,
          titularId: user.id
        })
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
        this.client.send('get.transparency.logs', user.id)
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}