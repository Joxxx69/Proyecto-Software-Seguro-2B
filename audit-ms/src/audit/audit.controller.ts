
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuditService } from './audit.service';
import { CreateAuditDto } from './dto/create-audit.dto';

@Controller()
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
}
