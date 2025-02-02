import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from '../config/services.config';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { UpdatePersonalDataDto } from './dto/update-personal-data.dto';
import { PaginationDto } from './dto/pagination.dto';
import { FilterPersonalDataDto } from './dto/filter-personal-data.dto';
import { CreatePersonalDataDto } from './dto/create-personal-data.dto';

@Injectable()
export class PersonalDataService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('PersonalData-Service');

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('MongoDb connected');
  }

  private handleError(error: any, defaultMessage: string, httpStatus: HttpStatus) {
    this.logger.error(error);

    if (error instanceof RpcException) throw error;
    if (error instanceof TimeoutError) {
      throw new RpcException({
        status: HttpStatus.GATEWAY_TIMEOUT,
        message: 'Operation timed out',
      });
    }

    throw new RpcException({
      status: httpStatus || HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || defaultMessage,
    });
  }

  async create(createDto: CreatePersonalDataDto) {
    try {
      /*
      const [usuario, consentimiento] = await Promise.all([
        firstValueFrom(
          this.client.send('find.user.by.id', { id: createDto.titularId })
        ),
        firstValueFrom(
          this.client.send('find.consent.by.id', { id: createDto.consentId })
        )
      ]);
      */
      const personalData = await this.personalData.create({
        data: {
          titularId: createDto.titularId,
          consentId: createDto.consentId,
          datosGenerales: createDto.datosGenerales,
          categoria: createDto.categoria,
          finalidad: createDto.finalidad,
          transferencias: createDto.transferencias ? {
            create: createDto.transferencias.map(transfer => ({
              destinatario: transfer.destinatario,
              finalidad: transfer.finalidad,
              baseLegal: transfer.baseLegal,
            }))
          } : undefined
        },
        include: {
          transferencias: true,
          sensitiveDatos: true,
          accessLogs: true
        }
      });

      await this.dataAccessLog.create({
        data: {
          personalDataId: personalData.id,
          usuarioId: createDto.titularId,
          accion: 'MODIFICACION',
          detalles: 'Creación inicial de datos personales'
        }
      });

      return personalData;
    } catch (error) {
      this.handleError(
        error,
        'Error al crear datos personales',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findAll(paginationDto: PaginationDto, filterDto?: FilterPersonalDataDto) {
    try {
      const { limit = 10, page = 1 } = paginationDto;
      const { titularId, fechaDesde, fechaHasta, incluirEliminados = false } = filterDto || {};

      const where = {
        eliminado: incluirEliminados ? undefined : false,
        ...(titularId && { titularId }),
        ...(fechaDesde || fechaHasta) && {
          fechaCreacion: {
            ...(fechaDesde && { gte: fechaDesde }),
            ...(fechaHasta && { lte: fechaHasta })
          }
        }
      };

      const [totalRecords, data] = await Promise.all([
        this.personalData.count({ where }),
        this.personalData.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            transferencias: true,
            sensitiveDatos: true
          },
          orderBy: { fechaCreacion: 'desc' }
        })
      ]);

      const lastPage = Math.ceil(totalRecords / limit);

      return {
        data,
        meta: {
          totalRecords,
          page,
          lastPage,
          hasNextPage: page < lastPage,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      this.handleError(
        error,
        'Error al obtener datos personales',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string) {
    try {
      const personalData = await this.personalData.findUnique({
        where: { id, eliminado: false },
        include: {
          transferencias: true,
          sensitiveDatos: true,
          accessLogs: {
            take: 10,
            orderBy: { fechaAcceso: 'desc' }
          }
        }
      });

      if (!personalData) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: "Datos personales con id ${id} no encontrados"
        });
      }

      return personalData;
    } catch (error) {
      this.handleError(
        error,
        'Error al obtener datos personales',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: string, updateDto: UpdatePersonalDataDto) {
    try {
      const existingData = await this.findOne(id);

      const updatedData = await this.personalData.update({
        where: { id, eliminado: false },
        data: {
          datosGenerales: updateDto.datosGenerales,
          finalidad: updateDto.finalidad,
          fechaActualizacion: new Date(),
          transferencias: updateDto.transferencias ? {
            deleteMany: {},
            create: updateDto.transferencias.map(transfer => ({
              destinatario: transfer.destinatario,
              finalidad: transfer.finalidad,
              baseLegal: transfer.baseLegal,
            }))
          } : undefined
        },
        include: {
          transferencias: true,
          sensitiveDatos: true
        }
      });

      await this.dataAccessLog.create({
        data: {
          personalDataId: id,
          usuarioId: existingData.titularId,
          accion: 'MODIFICACION',
          detalles: 'Actualización de datos personales'
        }
      });

      return {
        success: true,
        data: updatedData
      };
    } catch (error) {
      this.handleError(
        error,
        'Error al actualizar datos personales',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: string) {
    try {
      const existingData = await this.findOne(id);

      const deletedData = await this.personalData.update({
        where: { id, eliminado: false },
        data: {
          eliminado: true,
          fechaActualizacion: new Date()
        }
      });

      await this.dataAccessLog.create({
        data: {
          personalDataId: id,
          usuarioId: existingData.titularId,
          accion: 'ELIMINACION',
          detalles: 'Eliminación lógica de datos personales'
        }
      });

      return {
        success: true,
        message: "Datos personales con id ${ id } han sido eliminados"
      };
    } catch (error) {
      this.handleError(
        error,
        'Error al eliminar datos personales',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
