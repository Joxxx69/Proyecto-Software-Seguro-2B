// create-personal-data.dto.ts
import { IsString, IsObject, IsEnum, IsNotEmpty, IsUUID, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseLegal, CategoriaData } from '../enums/personalData.enum';

export class CreateDataTransferDto {
  @IsString()
  @IsNotEmpty()
  destinatario: string;

  @IsString()
  @IsNotEmpty()
  finalidad: string;

  @IsEnum(BaseLegal)
  @IsNotEmpty()
  baseLegal: BaseLegal;
}

export class CreatePersonalDataDto {
  @IsString()
  @IsOptional()
  //@IsUUID()
  titularId?: string;

  @IsOptional()
  @IsEnum(CategoriaData)
  categoria?: CategoriaData;

  @IsObject()
  @IsNotEmpty()
  datosGenerales: Record<string, any>;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateDataTransferDto)
  transferencias?: CreateDataTransferDto[];
}