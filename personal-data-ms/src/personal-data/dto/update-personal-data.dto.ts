// update-personal-data.dto.ts
import { IsString, IsObject, IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDataTransferDto } from './create-personal-data.dto';

export class UpdatePersonalDataDto {
  @IsObject()
  @IsOptional()
  datosGenerales?: Record<string, any>;

  @IsString()
  @IsOptional()
  finalidad?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateDataTransferDto)
  transferencias?: CreateDataTransferDto[];
}