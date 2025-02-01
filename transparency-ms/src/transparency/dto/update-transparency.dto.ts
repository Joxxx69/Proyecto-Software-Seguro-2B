import { PartialType } from '@nestjs/mapped-types';
import { CreateTransparencyDto } from './create-transparency.dto';

export class UpdateTransparencyDto extends PartialType(CreateTransparencyDto) {
  id: number;
}
