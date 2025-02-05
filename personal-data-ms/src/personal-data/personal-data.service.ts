import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ARCORequest, EstadoARCO, PrismaClient, TipoARCO } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from '../config/services.config';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { UpdatePersonalDataDto } from './dto/update-personal-data.dto';
import { PaginationDto } from './dto/pagination.dto';
import { FilterPersonalDataDto } from './dto/filter-personal-data.dto';
import { CreatePersonalDataDto } from './dto/create-personal-data.dto';
import { CreateARCORequestDto } from './dto/create-arco-request.dto';
import { FilterARCORequestDto } from './dto/filter-arco-request.dto';
import { UpdateARCORequestDto } from './dto/update-arco-request.dto';

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
      const personalData = await this.personalData.create({
        data: {
          titularId: createDto.titularId,
          datosGenerales: createDto.datosGenerales,
          categoria: createDto.categoria,
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

  // CRUD para Solicitudes ARCO
  async createARCORequest(createDto: CreateARCORequestDto) {
    try {
      const arcoRequest = await this.aRCORequest.create({
        data: {
          titularId: createDto.titularId,
          tipo: createDto.tipo,
          datosSolicitados: createDto.datosSolicitados,
          // estado y fechas se asignan automáticamente según el esquema
        }
      });

      return arcoRequest;
    } catch (error) {
      this.handleError(
        error,
        'Error al crear solicitud ARCO',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findAllARCORequests(paginationDto: PaginationDto, filterDto?: FilterARCORequestDto) {
    try {
      const { limit = 10, page = 1 } = paginationDto;
      const { titularId, tipo, estado, fechaDesde, fechaHasta } = filterDto || {};

      const where = {
        ...(titularId && { titularId }),
        ...(tipo && { tipo }),
        ...(estado && { estado }),
        ...(fechaDesde || fechaHasta) && {
          fechaSolicitud: {
            gte: fechaDesde,
            lte: fechaHasta
          }
        }
      };

      const [totalRecords, data] = await Promise.all([
        this.aRCORequest.count({ where }),
        this.aRCORequest.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { fechaSolicitud: 'desc' }
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
        'Error al obtener solicitudes ARCO',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOneARCORequest(id: string) {
    try {
      const arcoRequest = await this.aRCORequest.findUnique({
        where: { id }
      });

      if (!arcoRequest) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: `Solicitud ARCO con id ${id} no encontrada`
        });
      }

      return arcoRequest;
    } catch (error) {
      this.handleError(
        error,
        'Error al obtener solicitud ARCO',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateARCORequest(id: string, updateDto: UpdateARCORequestDto) {
    try {
      const existingRequest = await this.findOneARCORequest(id);

      if (existingRequest.estado !== EstadoARCO.PENDIENTE) {
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Solicitud ya procesada no puede modificarse'
        });
      }

      const updateData: any = {
        estado: updateDto.estado,
        motivoRechazo: updateDto.motivoRechazo,
        fechaRespuesta: new Date()
      };

      const updatedRequest = await this.aRCORequest.update({
        where: { id },
        data: updateData
      });

      // Ejecutar acciones según el tipo de solicitud
      if (updateDto.estado === EstadoARCO.COMPLETADO) {
        await this.processARCORequest(existingRequest);
      }

      return updatedRequest;
    } catch (error) {
      this.handleError(
        error,
        'Error al actualizar solicitud ARCO',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async processARCORequest(request: ARCORequest) {
    try {
      switch (request.tipo) {
        case TipoARCO.ACCESO:
          await this.client.emit('arco_access', request);
          break;
        case TipoARCO.RECTIFICACION:
          await this.client.emit('arco_rectification', request);
          break;
        case TipoARCO.CANCELACION:
          await this.client.emit('arco_deletion', {
            titularId: request.titularId,
            datosSolicitados: request.datosSolicitados
          });
          break;
        case TipoARCO.OPOSICION:
          await this.client.emit('arco_opposition', request);
          break;
      }
    } catch (error) {
      this.logger.error(`Error procesando solicitud ARCO: ${error.message}`);
    }
  }

  async deleteARCORequest(id: string) {
    try {
      await this.aRCORequest.delete({
        where: { id }
      });

      return {
        success: true,
        message: `Solicitud ARCO con id ${id} eliminada correctamente`
      };
    } catch (error) {
      this.handleError(
        error,
        'Error al eliminar solicitud ARCO',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

}
