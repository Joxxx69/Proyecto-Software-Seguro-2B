import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PersonalDataService } from './personal-data.service';
import { CreatePersonalDatumDto } from './dto/create-personal-datum.dto';
import { UpdatePersonalDatumDto } from './dto/update-personal-datum.dto';

@Controller()
export class PersonalDataController {
  constructor(private readonly personalDataService: PersonalDataService) {}

  @MessagePattern('createPersonalDatum')
  create(@Payload() createPersonalDatumDto: CreatePersonalDatumDto) {
    return this.personalDataService.create(createPersonalDatumDto);
  }

  @MessagePattern('findAllPersonalData')
  findAll() {
    return this.personalDataService.findAll();
  }

  @MessagePattern('findOnePersonalDatum')
  findOne(@Payload() id: number) {
    return this.personalDataService.findOne(id);
  }

  @MessagePattern('updatePersonalDatum')
  update(@Payload() updatePersonalDatumDto: UpdatePersonalDatumDto) {
    return this.personalDataService.update(updatePersonalDatumDto.id, updatePersonalDatumDto);
  }

  @MessagePattern('removePersonalDatum')
  remove(@Payload() id: number) {
    return this.personalDataService.remove(id);
  }
}
