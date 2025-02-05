export class UpdatePrivacyPolicyDto {
  version: string;
  contenido: string;
  cambios: string[];
  fechaEfectiva?: Date; // Hacemos opcional fechaEfectiva
  aprobacionesRequeridas?: boolean;
}