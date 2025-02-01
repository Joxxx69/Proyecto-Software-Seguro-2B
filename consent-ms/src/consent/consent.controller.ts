import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConsentService } from './consent.service';
import { CreateConsentDto } from './dto/create-consent.dto';
import { UpdateConsentDto } from './dto/update-consent.dto';

@Controller()
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @MessagePattern('createConsent')
  create(@Payload() createConsentDto: CreateConsentDto) {
    return this.consentService.create(createConsentDto);
  }

  @MessagePattern('findAllConsent')
  findAll() {
    return this.consentService.findAll();
  }

  @MessagePattern('findOneConsent')
  findOne(@Payload() id: number) {
    return this.consentService.findOne(id);
  }

  @MessagePattern('updateConsent')
  update(@Payload() updateConsentDto: UpdateConsentDto) {
    return this.consentService.update(updateConsentDto.id, updateConsentDto);
  }

  @MessagePattern('removeConsent')
  remove(@Payload() id: number) {
    return this.consentService.remove(id);
  }
}
