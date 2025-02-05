import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoARCO } from '@prisma/client';

export class UpdateARCORequestDto {
  @IsEnum(EstadoARCO)
  estado: EstadoARCO;

  @IsOptional()
  @IsString()
  motivoRechazo?: string;
}