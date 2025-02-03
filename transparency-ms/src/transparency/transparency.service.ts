import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { CreateTransparencyNotificationDto } from './dto/create-transparency-notification.dto';
import { UpdatePrivacyPolicyDto } from './dto/update-privacy-policy.dto';

@Injectable()
export class TransparencyService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Transparency-Service');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('MongoDB connected');
  }

  async createNotification(createDto: CreateTransparencyNotificationDto) {
    try {
      const notification = await this.transparencyLog.create({
        data: {
          usuarioId: createDto.titularId,
          tipoAcceso: createDto.tipo,
          datosConsulta: createDto.detalles
        }
      });

      // Si es una brecha de seguridad, crear registro especial
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
          estado: 'ACTIVA'
        }
      });

      // Actualizar política anterior a histórica
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