export class CreateNotificationDto {
  titularId: string;
  tipo: 'BREACH' | 'POLICY_CHANGE' | 'DATA_ACCESS';
  titulo: string;
  descripcion: string;
  detalles?: any;
  requiereAccion?: boolean;
}