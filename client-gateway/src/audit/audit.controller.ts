import { Controller, Get, Post, Body, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from '../config/services.config';
import { firstValueFrom } from 'rxjs';
import { CreateAuditDto } from './dto/create-audit.dto';

@Controller('audit')
export class AuditController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  async createAudit(@Body() createAuditDto: CreateAuditDto) {
    return await firstValueFrom(this.client.send('audit.create', createAuditDto));
  }

  @Get()
  async getAudits() {
    return await firstValueFrom(this.client.send('audit.getAll', {}));
  }

  @Get(':id')
  async getAuditById(@Param('id') id: string) {
    return await firstValueFrom(this.client.send('audit.getOne', id));
  }
}
