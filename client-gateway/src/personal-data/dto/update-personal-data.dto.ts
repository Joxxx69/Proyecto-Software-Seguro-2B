import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonalDataDto } from './create-personal-data.dto';
import { CategoriaData } from '../enums/personalData.enum';

export class UpdatePersonalDataDto extends PartialType(CreatePersonalDataDto) {
  /*   
   datosGenerales?: object;
     categoria?: CategoriaData;
     finalidad?: string;
     transferencias?: DataTransfer[];
 
 */
}
