import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransparencyService } from './transparency.service';
import { PrivacyPolicyDto } from './dto/privacy-policy.dto';

@Controller()
export class TransparencyController {
  constructor(private readonly transparencyService: TransparencyService) {}

  @MessagePattern('get.current.privacy.policy')
  getCurrentPrivacyPolicy() {
    return this.transparencyService.getCurrentPrivacyPolicy();
  }

  @MessagePattern('update.privacy.policy')
  updatePrivacyPolicy(@Payload() updateDto: PrivacyPolicyDto) {
    return this.transparencyService.updatePrivacyPolicy(updateDto);
  }

  @MessagePattern('get.access.logs')
  getAccessLogs(@Payload() userId: string) {
    return this.transparencyService.getAccessLogs(userId);
  }
}
