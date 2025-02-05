import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { CreateNotificationDto } from './dto/create-transparency-notification.dto';
import { UpdatePrivacyPolicyDto } from './dto/update-privacy-policy.dto';

@Injectable()
export class TransparencyService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Transparency-Service');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('MongoDb connected');
  }

  async createNotification(createDto: CreateNotificationDto) {
    try {
      const notification = await this.transparencyLog.create({
        data: {
          usuarioId: createDto.titularId,
          tipoAcceso: this.mapTipoAcceso(createDto.tipo), // Mapeamos el tipo
          datosConsulta: createDto.detalles
        }
      });

      if(createDto.tipo === 'BREACH') {
        await this.dataSubjectRequest.create({
          data: {
            titularId: createDto.titularId,
            tipo: 'SEGURIDAD',
            estado: 'PENDIENTE',
            respuesta: JSON.stringify(createDto.detalles)
          }
        });
      }

      return notification;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async updatePrivacyPolicy(updateDto: UpdatePrivacyPolicyDto) {
    try {
      const policy = await this.privacyPolicy.create({
        data: {
          version: updateDto.version,
          contenido: updateDto.contenido,
          cambios: updateDto.cambios,
          estado: 'ACTIVA',
          fechaEfectiva: updateDto.fechaEfectiva || new Date(), // Añadimos fechaEfectiva
          fechaPublicacion: new Date()
        }
      });

      await this.privacyPolicy.updateMany({
        where: { 
          NOT: { id: policy.id },
          estado: 'ACTIVA'
        },
        data: { estado: 'HISTORICA' }
      });

      return policy;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  // Función helper para mapear tipos
  private mapTipoAcceso(tipo: string): 'POLITICA_PRIVACIDAD' | 'FINALIDAD_TRATAMIENTO' | 'DESTINATARIOS' | 'DERECHOS_ARCO' | 'MEDIDAS_SEGURIDAD' | 'REGISTRO_ACTIVIDAD' {
    const tipoMap = {
      'BREACH': 'REGISTRO_ACTIVIDAD',
      'POLICY_CHANGE': 'POLITICA_PRIVACIDAD',
      'DATA_ACCESS': 'DESTINATARIOS',
    };
    return tipoMap[tipo] || 'REGISTRO_ACTIVIDAD';
  }

  async getTransparencyData(titularId: string) {
    try {
      const [policies, requests, logs] = await Promise.all([
        this.privacyPolicy.findFirst({
          where: { estado: 'ACTIVA' }
        }),
        this.dataSubjectRequest.findMany({
          where: { titularId }
        }),
        this.transparencyLog.findMany({
          where: { usuarioId: titularId }
        })
      ]);

      return {
        currentPolicy: policies,
        requests,
        accessLogs: logs
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}