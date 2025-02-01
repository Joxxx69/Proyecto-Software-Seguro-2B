import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateTransparencyDto } from './dto/create-transparency.dto';
import { UpdateTransparencyDto } from './dto/update-transparency.dto';
import { PrismaClient } from '@prisma/client';
import { NATS_SERVICE } from 'src/config/services.config';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TransparencyService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(TransparencyService.name);

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
    super()

  }

  async onModuleInit() {
    this.$connect();
    this.logger.log('MongoDb connected')

  }

  create(createTransparencyDto: CreateTransparencyDto) {
    return 'This action adds a new transparency';
  }

  findAll() {
    return `This action returns all transparency`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transparency`;
  }

  update(id: number, updateTransparencyDto: UpdateTransparencyDto) {
    return `This action updates a #${id} transparency`;
  }

  remove(id: number) {
    return `This action removes a #${id} transparency`;
  }
}
