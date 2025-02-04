import { IsString, IsArray, IsEnum, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';
import { BaseLegal, MetodoObtencion } from '@prisma/client';

export class CreateConsentDto {
  @IsString()
  @IsOptional()
  titularId: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  finalidades: string[];

  @IsEnum(BaseLegal)
  @IsNotEmpty()
  baseLegal: BaseLegal;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  datosTratados: string[];

  @IsEnum(MetodoObtencion)
  @IsNotEmpty()
  metodoObtencion: MetodoObtencion;

  @IsString()
  @IsNotEmpty()
  version: string;
}