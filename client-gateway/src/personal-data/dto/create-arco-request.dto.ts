import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EstadoARCO, TipoARCO } from '../enums/personalData.enum';

export class CreateARCORequestDto {
  @IsOptional()
  @IsString()
  titularId?: string;

  @IsNotEmpty()
  @IsEnum(TipoARCO)
  tipo: TipoARCO;

  @IsEnum(EstadoARCO)
  estado: EstadoARCO;

  @IsArray()
  @IsString({ each: true })
  datosSolicitados: string[];

  @IsOptional()
  @IsString()
  motivoRechazo?: string;
}
