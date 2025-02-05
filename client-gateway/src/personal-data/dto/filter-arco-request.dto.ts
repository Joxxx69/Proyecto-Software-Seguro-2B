import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoARCO, TipoARCO } from '../enums/personalData.enum';

export class FilterARCORequestDto {
  @IsOptional()
  @IsString()
  titularId?: string;

  @IsOptional()
  @IsEnum(TipoARCO)
  tipo?: TipoARCO;

  @IsOptional()
  @IsEnum(EstadoARCO)
  estado?: EstadoARCO;

  @IsOptional()
  @IsDateString()
  fechaDesde?: Date;

  @IsOptional()
  @IsDateString()
  fechaHasta?: Date;
}