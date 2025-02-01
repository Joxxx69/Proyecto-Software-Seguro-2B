import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransparencyService } from './transparency.service';
import { CreateTransparencyDto } from './dto/create-transparency.dto';
import { UpdateTransparencyDto } from './dto/update-transparency.dto';

@Controller()
export class TransparencyController {
  constructor(private readonly transparencyService: TransparencyService) {}

  @MessagePattern('createTransparency')
  create(@Payload() createTransparencyDto: CreateTransparencyDto) {
    return this.transparencyService.create(createTransparencyDto);
  }

  @MessagePattern('findAllTransparency')
  findAll() {
    return this.transparencyService.findAll();
  }

  @MessagePattern('findOneTransparency')
  findOne(@Payload() id: number) {
    return this.transparencyService.findOne(id);
  }

  @MessagePattern('updateTransparency')
  update(@Payload() updateTransparencyDto: UpdateTransparencyDto) {
    return this.transparencyService.update(updateTransparencyDto.id, updateTransparencyDto);
  }

  @MessagePattern('removeTransparency')
  remove(@Payload() id: number) {
    return this.transparencyService.remove(id);
  }
}
