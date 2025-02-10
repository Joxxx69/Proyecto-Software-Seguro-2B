import { IsString, IsEmail, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';

export class CreatePersonalDataDto {
  @IsOptional()
  @IsString()
  titularId?: string;  // Optional porque se asigna automáticamente desde el token

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  documentNumber?: string;

  @IsString()
  purpose: string;

  @IsString()
  legalBasis: string;

  @IsOptional()
  @IsDateString()
  retentionTime?: Date;
}