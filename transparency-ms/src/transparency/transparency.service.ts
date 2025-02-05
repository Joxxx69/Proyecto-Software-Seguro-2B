import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { PrivacyPolicyDto } from './dto/privacy-policy.dto';

@Injectable()
export class TransparencyService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Transparency-Service');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('MongoDb connected');
  }

  async getCurrentPrivacyPolicy() {
    try {
      return await this.privacyPolicy.findFirst({
        where: {
          estado: 'ACTIVA'
        },
        orderBy: {
          fechaPublicacion: 'desc'
        }
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async updatePrivacyPolicy(updateDto: PrivacyPolicyDto) {
    try {
      // Desactivar política actual
      await this.privacyPolicy.updateMany({
        where: { estado: 'ACTIVA' },
        data: { estado: 'HISTORICA' }
      });

      // Crear nueva política
      return await this.privacyPolicy.create({
        data: {
          version: updateDto.version,
          contenido: updateDto.contenido,
          fechaEfectiva: updateDto.fechaEfectiva,
          fechaPublicacion: new Date(),
          cambios: updateDto.cambios,
          estado: 'ACTIVA'
        }
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getAccessLogs(userId: string) {
    try {
      return await this.transparencyLog.findMany({
        where: {
          usuarioId: userId
        },
        orderBy: {
          fechaAcceso: 'desc'
        },
        take: 50 // Limitar a los últimos 50 registros
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}