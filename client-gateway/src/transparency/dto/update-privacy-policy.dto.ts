export class UpdatePrivacyPolicyDto {
    version: string;
    contenido: string;
    fechaEfectiva: Date;
    cambios: string[];
    aprobacionesRequeridas?: boolean;
  }