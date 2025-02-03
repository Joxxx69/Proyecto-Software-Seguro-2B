import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../auth/decorators';
import { CurrentUser } from '../auth/interfaces/current-user.interface';

@Controller('transparency')
export class TransparencyController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Get('data')
  async getTransparencyData(@User() user: CurrentUser) {
    try {
      return await firstValueFrom(
        this.client.send('get.transparency.data', user.id)
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Post('notification')
  async createNotification(
    @Body() createDto: CreateTransparencyNotificationDto,
    @User() user: CurrentUser
  ) {
    try {
      createDto.titularId = user.id;
      return await firstValueFrom(
        this.client.send('create.transparency.notification', createDto)
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}