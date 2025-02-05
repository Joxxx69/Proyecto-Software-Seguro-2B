import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuditService } from './audit.service';
import { CreateAuditDto } from './dto/create-audit.dto';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  // 📌 Escuchar peticiones de client-gateway para obtener todas las auditorías
  @MessagePattern('audit.getAll')
  async findAll() {
    return this.auditService.findAll();
  }

  // 📌 Escuchar peticiones de client-gateway para obtener una auditoría específica
  @MessagePattern('audit.getOne')
  async findOne(@Payload() id: string) {
    return this.auditService.findOne(id);
  }

  // 📌 Escuchar peticiones de client-gateway para crear una auditoría
  @MessagePattern('audit.create')
  async create(@Payload() createAuditDto: CreateAuditDto) {
    return this.auditService.createAudit(createAuditDto);
  }

  // 📌 Nuevo patrón de mensaje para obtener logs de acceso desde personal-data
  @MessagePattern('audit.getAccessLogs')
  async getAccessLogs(@Payload() personalDataId: string) {
    return this.auditService.getPersonalDataAccessLogs(personalDataId);
  }

  // 📌 Nuevo endpoint HTTP para obtener logs de acceso desde personal-data
  @Get('logs/:personalDataId')
  async getAccessLogsHttp(@Param('personalDataId') personalDataId: string) {
    return this.auditService.getPersonalDataAccessLogs(personalDataId);
  }
}