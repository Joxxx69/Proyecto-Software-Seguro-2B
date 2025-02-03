import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { CreateConsentDto } from './dto/create-consent.dto';
import { UpdateConsentDto } from './dto/update-consent.dto';

@Injectable()
export class ConsentService extends PrismaClient {
  private readonly logger = new Logger('Consent-Service');

  constructor() {
    super();
  }

  private handleError(error: any, defaultMessage: string, httpStatus: HttpStatus) {
    this.logger.error(error);

    if (error instanceof RpcException) throw error;

    throw new RpcException({
      status: httpStatus || HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || defaultMessage,
    });
  }

  async create(createConsentDto: CreateConsentDto) {
    try {
      // Crear el consentimiento sin validar la existencia del usuario
      const consent = await this.consent.create({
        data: {
          titularId: createConsentDto.titularId,
          finalidades: createConsentDto.finalidades,
          baseLegal: createConsentDto.baseLegal,
          datosTratados: createConsentDto.datosTratados,
          metodoObtencion: createConsentDto.metodoObtencion,
          version: createConsentDto.version,
        },
      });

      this.logger.log(`Consentimiento creado con ID: ${consent.id}`);
      return consent;
    } catch (error) {
      this.handleError(
        error,
        'Error al crear consentimiento',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<any[]> {
    try {
      const consents = await this.consent.findMany({
        where: { estado: 'ACTIVO' }, // Solo devuelve consentimientos activos
      });

      this.logger.log(`Encontrados ${consents.length} consentimientos`);
      return consents;
    } catch (error) {
      this.handleError(
        error,
        'Error al obtener consentimientos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const consent = await this.consent.findUnique({
        where: { id },
      });

      if (!consent) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: `Consentimiento con ID ${id} no encontrado`,
        });
      }

      this.logger.log(`Consentimiento encontrado con ID: ${consent.id}`);
      return consent;
    } catch (error) {
      this.handleError(
        error,
        'Error al obtener consentimiento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByTitular(titularId: string): Promise<any[]> {
    try {
      const consents = await this.consent.findMany({
        where: { titularId, estado: 'ACTIVO' }, // Solo devuelve consentimientos activos del titular
      });

      this.logger.log(`Encontrados ${consents.length} consentimientos para el titular: ${titularId}`);
      return consents;
    } catch (error) {
      this.handleError(
        error,
        'Error al obtener consentimientos del titular',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateConsentDto: UpdateConsentDto): Promise<any> {
    try {
      const existingConsent = await this.findOne(id);

      // Actualizar el consentimiento sin validar la existencia del usuario
      const updatedConsent = await this.consent.update({
        where: { id },
        data: {
          titularId: updateConsentDto.titularId,
          finalidades: updateConsentDto.finalidades,
          baseLegal: updateConsentDto.baseLegal,
          datosTratados: updateConsentDto.datosTratados,
          metodoObtencion: updateConsentDto.metodoObtencion,
          version: updateConsentDto.version,
          estado: updateConsentDto.estado,
          fechaRevocacion: updateConsentDto.fechaRevocacion,
        },
      });

      this.logger.log(`Consentimiento actualizado con ID: ${updatedConsent.id}`);
      return updatedConsent;
    } catch (error) {
      this.handleError(
        error,
        'Error al actualizar consentimiento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async revoke(id: string): Promise<any> {
    try {
      const existingConsent = await this.findOne(id);

      const revokedConsent = await this.consent.update({
        where: { id },
        data: {
          estado: 'REVOCADO', // Cambia el estado a REVOCADO
          fechaRevocacion: new Date(),
        },
      });

      this.logger.log(`Consentimiento revocado con ID: ${revokedConsent.id}`);
      return revokedConsent;
    } catch (error) {
      this.handleError(
        error,
        'Error al revocar consentimiento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const existingConsent = await this.findOne(id);

      await this.consent.delete({
        where: { id },
      });

      this.logger.log(`Consentimiento eliminado con ID: ${id}`);
    } catch (error) {
      this.handleError(
        error,
        'Error al eliminar consentimiento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateConsent(titularId: string, finalidad: string): Promise<boolean> {
    try {
      const consents = await this.findByTitular(titularId);

      const isValid = consents.some(
        (consent) =>
          consent.estado === 'ACTIVO' && consent.finalidades.includes(finalidad),
      );

      this.logger.log(`Validación de consentimiento para titular ${titularId} y finalidad ${finalidad}: ${isValid}`);
      return isValid;
    } catch (error) {
      this.handleError(
        error,
        'Error al validar consentimiento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}