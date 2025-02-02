import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PersonalDataService } from './personal-data.service';
import { CreatePersonalDataDto} from './dto/create-personal-data.dto';
import { UpdatePersonalDataDto } from './dto/update-personal-data.dto';
import { PaginationDto } from './dto/pagination.dto';
import { MongoIdDto } from './dto/mongo-id.dto';


@Controller()
export class PersonalDataController {
  constructor(private readonly personalDataService: PersonalDataService) {}

  @MessagePattern('create.personal.data')
  create(@Payload() createDto: CreatePersonalDataDto) {
    return this.personalDataService.create(createDto);
  }

  @MessagePattern('find.all.personal.data')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.personalDataService.findAll(paginationDto);
  }

  @MessagePattern('find.personal.data.by.id')
  findOne(@Payload() mongoIdDto: string) {
    return this.personalDataService.findOne(mongoIdDto);
  }

  @MessagePattern('update.personal.data')
  update(@Payload() payload: { id: string, updateDto: UpdatePersonalDataDto }) {
    return this.personalDataService.update(payload.id, payload.updateDto);
  }

  @MessagePattern('remove.personal.data')
  remove(@Payload() mongoIdDto: MongoIdDto) {
    return this.personalDataService.remove(mongoIdDto.id);
  }
}