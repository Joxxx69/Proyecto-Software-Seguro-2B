import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuditService } from './audit.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';

@Controller()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @MessagePattern('createAudit')
  create(@Payload() createAuditDto: CreateAuditDto) {
    return this.auditService.create(createAuditDto);
  }

  @MessagePattern('findAllAudit')
  findAll() {
    return this.auditService.findAll();
  }

  @MessagePattern('findOneAudit')
  findOne(@Payload() id: number) {
    return this.auditService.findOne(id);
  }

  @MessagePattern('updateAudit')
  update(@Payload() updateAuditDto: UpdateAuditDto) {
    return this.auditService.update(updateAuditDto.id, updateAuditDto);
  }

  @MessagePattern('removeAudit')
  remove(@Payload() id: number) {
    return this.auditService.remove(id);
  }
}
