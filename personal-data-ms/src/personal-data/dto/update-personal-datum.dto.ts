import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonalDatumDto } from './create-personal-datum.dto';

export class UpdatePersonalDatumDto extends PartialType(CreatePersonalDatumDto) {
  id: number;
}
