export class AccessLogDto {
    usuarioId: string;
    tipoAcceso: string;
    fechaAcceso: Date;
    detalles?: string;
  }