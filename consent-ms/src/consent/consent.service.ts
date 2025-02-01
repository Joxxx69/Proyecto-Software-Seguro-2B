import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateConsentDto } from './dto/create-consent.dto';
import { UpdateConsentDto } from './dto/update-consent.dto';
import { PrismaClient } from '@prisma/client';
import { NATS_SERVICE } from 'src/config/services.config';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ConsentService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(ConsentService.name);

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
    super()

  }

  async onModuleInit() {
    this.$connect();
    this.logger.log('MongoDb connected')

  }

  create(createConsentDto: CreateConsentDto) {
    return 'This action adds a new consent';
  }

  findAll() {
    return `This action returns all consent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} consent`;
  }

  update(id: number, updateConsentDto: UpdateConsentDto) {
    return `This action updates a #${id} consent`;
  }

  remove(id: number) {
    return `This action removes a #${id} consent`;
  }
}
