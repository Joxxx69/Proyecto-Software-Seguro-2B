import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TipoEvento, NivelRiesgo } from '@prisma/client';

export class CreateAuditDto {
  @IsEnum(TipoEvento)
  evento: TipoEvento;

  @IsOptional()
  @IsString()
  usuarioId?: string;

  @IsNotEmpty()
  @IsString()
  entidadAfectada: string;

  @IsNotEmpty()
  @IsString()
  entidadId: string;

  @IsNotEmpty()
  detalles: any;

  @IsOptional()
  @IsEnum(NivelRiesgo)
  nivelRiesgo?: NivelRiesgo;
}
