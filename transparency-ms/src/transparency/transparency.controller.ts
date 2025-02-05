import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransparencyService } from './transparency.service';
import { CreateNotificationDto } from './dto/create-transparency-notification.dto';
import { UpdatePrivacyPolicyDto } from './dto/update-privacy-policy.dto';

@Controller()
export class TransparencyController {
  constructor(private readonly transparencyService: TransparencyService) {}

  @MessagePattern('create.transparency.notification')
  createNotification(@Payload() createDto: CreateNotificationDto) {
    return this.transparencyService.createNotification(createDto);
  }

  @MessagePattern('update.privacy.policy')
  updatePrivacyPolicy(@Payload() updateDto: UpdatePrivacyPolicyDto) {
    return this.transparencyService.updatePrivacyPolicy(updateDto);
  }

  @MessagePattern('get.transparency.data')
  getTransparencyData(@Payload() titularId: string) {
    return this.transparencyService.getTransparencyData(titularId);
  }
}