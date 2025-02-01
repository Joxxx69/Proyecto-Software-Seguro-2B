import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreatePersonalDatumDto } from './dto/create-personal-datum.dto';
import { UpdatePersonalDatumDto } from './dto/update-personal-datum.dto';
import { PrismaClient } from '@prisma/client';
import { NATS_SERVICE } from 'src/config/services.config';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PersonalDataService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(PersonalDataService.name);

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
    super()

  }

  async onModuleInit() {
    this.$connect();
    this.logger.log('MongoDb connected')

  }

  create(createPersonalDatumDto: CreatePersonalDatumDto) {
    return 'This action adds a new personalDatum';
  }

  findAll() {
    return `This action returns all personalData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} personalDatum`;
  }

  update(id: number, updatePersonalDatumDto: UpdatePersonalDatumDto) {
    return `This action updates a #${id} personalDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} personalDatum`;
  }
}
