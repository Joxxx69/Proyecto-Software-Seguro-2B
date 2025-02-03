// ❌ Esto NO debería estar aquí porque `client-gateway` no usa Prisma
// import { TipoEvento, NivelRiesgo } from '@prisma/client';

// ✅ Definir los tipos manualmente en `client-gateway`
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum TipoEvento {
  ACCESO = 'ACCESO',
  MODIFICACION = 'MODIFICACION',
  ELIMINACION = 'ELIMINACION',
  VIOLACION_SEGURIDAD = 'VIOLACION_SEGURIDAD',
}

export enum NivelRiesgo {
  BAJO = 'BAJO',
  MEDIO = 'MEDIO',
  ALTO = 'ALTO',
}

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
