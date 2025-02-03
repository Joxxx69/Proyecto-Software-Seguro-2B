export class CreateTransparencyNotificationDto {
    titularId: string;
    tipo: string; // BREACH | POLICY_CHANGE | DATA_ACCESS
    descripcion: string;
    detalles: any;
    requiereAprobacion?: boolean;
  }