import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/services.config';
import { CreatePersonalDataDto } from './dto/create-personal-data.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MongoIdDto } from 'src/user/dto/mongo-id.dto';
import { UpdatePersonalDataDto } from './dto/update-personal-data.dto';
import { firstValueFrom } from 'rxjs';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/roles.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interfaces/current-user.interface';

@Controller('personal-data')
export class PersonalDataController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN_ROLE, Role.USER_ROLE)
  @Post("create")
  async createPersonalData(@Body() createDto: CreatePersonalDataDto, @User() user: CurrentUser) {
    try {
      console.log({user})
      createDto.titularId=user.id
      const response = await firstValueFrom(
        this.client.send('create.personal.data', createDto),
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  //@UseGuards(AuthGuard)
  //@Roles(Role.ADMIN_ROLE)
  @Get()
  async getAllPersonalData(@Query() paginationDto: PaginationDto) {
    try {
      const response = await firstValueFrom(
        this.client.send('find.all.personal.data', paginationDto),
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  //@UseGuards(AuthGuard)
  //@Roles(Role.ADMIN_ROLE, Role.USER_ROLE)
  @Get(':id')
  async getPersonalDataById(@Param("id") params: string) {
    try {
      const response = await firstValueFrom(
        this.client.send('find.personal.data.by.id', params),
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  //@UseGuards(AuthGuard)
  //@Roles(Role.ADMIN_ROLE, Role.USER_ROLE)
  @Patch(':id')
  async updatePersonalData(
    @Param() params: MongoIdDto,
    @Body() updateDto: UpdatePersonalDataDto,
  ) {
    try {
      const response = await firstValueFrom(
        this.client.send('update.personal.data', { id: params.id, updateDto }),
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  //@UseGuards(AuthGuard)
  //@Roles(Role.ADMIN_ROLE)
  @Delete(':id')
  async deletePersonalData(@Param() params: MongoIdDto) {
    try {
      const response = await firstValueFrom(
        this.client.send('remove.personal.data', { id: params.id }),
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
