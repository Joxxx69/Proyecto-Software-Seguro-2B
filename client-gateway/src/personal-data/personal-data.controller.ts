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
import { FilterARCORequestDto } from './dto/filter-arco-request.dto';
import { CreateARCORequestDto } from './dto/create-arco-request.dto';
import { UpdateARCORequestDto } from './dto/update-arco-request.dto';

@Controller('personal-data')
export class PersonalDataController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN_ROLE, Role.USER_ROLE)
  @Post("create")
  async createPersonalData(@Body() createDto: CreatePersonalDataDto, @User() user: CurrentUser) {
    try {
      console.log({ user })
      createDto.titularId = user.id
      const response = await firstValueFrom(
        this.client.send('create.personal.data', createDto),
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN_ROLE)
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

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN_ROLE, Role.USER_ROLE)
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

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN_ROLE, Role.USER_ROLE)
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

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN_ROLE)
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


  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN_ROLE, Role.USER_ROLE)
  @Post('createAR')
  async createARCORequest(
    @Body() createDto: CreateARCORequestDto,
    @User() user: CurrentUser
  ) {
    try {
      createDto.titularId = user.id;
      const response = await firstValueFrom(
        this.client.send('create_arco_request', createDto)
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }


  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN_ROLE)
  @Get()
  async getAllARCORequests(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterARCORequestDto
  ) {
    try {
      const response = await firstValueFrom(
        this.client.send('find_all_arco_requests', { paginationDto, filterDto })
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN_ROLE, Role.USER_ROLE)
  @Get('AR/:id')
  async getARCORequestById(@Param("id") params: string) {
    try {
      const response = await firstValueFrom(
        this.client.send('find_one_arco_request', params)
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN_ROLE)
  @Patch('AR/:id')
  async updateARCORequest(
    @Param() params: MongoIdDto,
    @Body() updateDto: UpdateARCORequestDto
  ) {
    try {
      const response = await firstValueFrom(
        this.client.send('update_arco_request', {
          id: params.id,
          updateDto
        })
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN_ROLE)
  @Delete('AR/:id')
  async deleteARCORequest(@Param() params: MongoIdDto) {
    try {
      const response = await firstValueFrom(
        this.client.send('delete_arco_request', params.id)
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN_ROLE, Role.USER_ROLE)
  @Get('user/requests')
  async getUserARCORequests(
    @User() user: CurrentUser,
    @Query() paginationDto: PaginationDto
  ) {
    try {
      const filterDto: FilterARCORequestDto = {
        titularId: user.id
      };
      const response = await firstValueFrom(
        this.client.send('find_all_arco_requests', {
          paginationDto,
          filterDto
        })
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }


}
