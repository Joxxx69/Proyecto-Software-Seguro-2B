import { PartialType } from '@nestjs/mapped-types';
import { CreateConsentDto } from './create-consent.dto';
import { IsString, IsOptional, IsEnum, IsDate, IsMongoId } from 'class-validator';
import { EstadoConsent } from '@prisma/client';

export class UpdateConsentDto extends PartialType(CreateConsentDto) {
  @IsString()
  @IsOptional()
  @IsMongoId() // Valida que sea un ObjectId válido
  id?: string;

  @IsEnum(EstadoConsent)
  @IsOptional()
  estado?: EstadoConsent;

  @IsDate()
  @IsOptional()
  fechaRevocacion?: Date;
}