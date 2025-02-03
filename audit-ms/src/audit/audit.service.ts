import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAuditDto } from './dto/create-audit.dto';
import { NATS_SERVICE } from '../config/services.config';

@Injectable()
export class AuditService implements OnModuleInit {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    private readonly prisma: PrismaService,  // ✅ PrismaService inyectado correctamente
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  async onModuleInit() {
    await this.prisma.$connect();
    this.logger.log('MongoDB conectado en AuditService');
  }

  async createAudit(createAuditDto: CreateAuditDto) {
    const audit = await this.prisma.auditLog.create({ data: createAuditDto });
    this.client.emit('audit.created', audit); // Enviar evento a otros servicios
    return audit;
  }

  async findAll() {
    return this.prisma.auditLog.findMany();
  }

  async findOne(id: string) {
    return this.prisma.auditLog.findUnique({ where: { id } });
  }
}
