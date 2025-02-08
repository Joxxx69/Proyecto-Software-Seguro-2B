import { IsEnum, IsString, IsOptional, IsDateString } from 'class-validator';
import { ArcoStatus, TipoArco } from '../enums/personalData.enum';
export class FilterARCORequestDto {
  @IsOptional()
  @IsString()
  titularId?: string;

  @IsOptional()
  @IsEnum(TipoArco)
  tipo?: TipoArco;

  @IsOptional()
  @IsEnum(ArcoStatus)
  status?: ArcoStatus;

  @IsOptional()
  @IsDateString()
  dateFrom?: Date;

  @IsOptional()
  @IsDateString()
  dateTo?: Date;
}