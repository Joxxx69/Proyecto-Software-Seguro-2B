import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PersonalDataService } from './personal-data.service';
import { CreatePersonalDataDto } from './dto/create-personal-data.dto';
import { UpdatePersonalDataDto } from './dto/update-personal-data.dto';
import { PaginationDto } from './dto/pagination.dto';
import { MongoIdDto } from './dto/mongo-id.dto';
import { CreateARCORequestDto } from './dto/create-arco-request.dto';
import { FilterARCORequestDto } from './dto/filter-arco-request.dto';
import { UpdateARCORequestDto } from './dto/update-arco-request.dto';


@Controller()
export class PersonalDataController {
  constructor(private readonly personalDataService: PersonalDataService) { }

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

  @MessagePattern('find.personal.data.by.titularId')
  findByTitularId(@Payload() titularId: string) {
    return this.personalDataService.findByTitularId(titularId);
  }

  @MessagePattern('update.personal.data')
  update(@Payload() payload: { id: string, updateDto: UpdatePersonalDataDto }) {
    return this.personalDataService.update(payload.id, payload.updateDto);
  }

  @MessagePattern('remove.personal.data')
  remove(@Payload() mongoIdDto: MongoIdDto) {
    return this.personalDataService.remove(mongoIdDto.id);
  }

  @MessagePattern('create_arco_request')
  async createARCORequest(@Payload() createDto: CreateARCORequestDto) {
    return await this.personalDataService.createARCORequest(createDto);
  }

  @MessagePattern('find_all_arco_requests')
  async findAllARCORequests(
    @Payload() payload: { paginationDto: PaginationDto; filterDto?: FilterARCORequestDto },
  ) {
    const { paginationDto, filterDto } = payload;
    return await this.personalDataService.findAllARCORequests(paginationDto, filterDto);
  }

  @MessagePattern('find_one_arco_request')
  async findOneARCORequest(@Payload() id: string) {
    return await this.personalDataService.findOneARCORequest(id);
  }


  @MessagePattern('update_arco_request')
  async updateARCORequest(
    @Payload() payload: { id: string; updateDto: UpdateARCORequestDto },
  ) {
    const { id, updateDto } = payload;
    return await this.personalDataService.updateARCORequest(id, updateDto);
  }

  @MessagePattern('delete_arco_request')
  async deleteARCORequest(@Payload() id: string) {
    return await this.personalDataService.deleteARCORequest(id);
  }

}