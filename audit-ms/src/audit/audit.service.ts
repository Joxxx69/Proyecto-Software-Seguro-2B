import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAuditDto } from './dto/create-audit.dto';
import { NATS_SERVICE } from '../config/services.config';
import { firstValueFrom } from 'rxjs';
import { Controller, Get, Param } from '@nestjs/common';

@Injectable()
export class AuditService implements OnModuleInit {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    private readonly prisma: PrismaService,  
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  async onModuleInit() {
    await this.prisma.$connect();
    this.logger.log('MongoDB conectado en AuditService');
  }

  async createAudit(createAuditDto: CreateAuditDto) {
    const audit = await this.prisma.auditLog.create({ data: createAuditDto });
    this.client.emit('audit.created', audit);
    return audit;
  }

  async findAll() {
    return this.prisma.auditLog.findMany();
  }

  async findOne(id: string) {
    return this.prisma.auditLog.findUnique({ where: { id } });
  }

  // Nueva función para obtener logs de acceso desde el microservicio de personal-data
  async getPersonalDataAccessLogs(personalDataId: string) {
    try {
      const logs = await firstValueFrom(
        this.client.send('find.personal.data.by.id', { id: personalDataId })
      );
      return logs?.accessLogs || [];
    } catch (error) {
      this.logger.error('Error al obtener logs de acceso', error);
      throw error;
    }
  }
}
