import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';
import { QueryOccurrenceDto } from './dto/query-occurrence.dto';
import { OccurrenceStatus } from '@prisma/client';
import * as moment from 'moment';

@Injectable()
export class OccurrencesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Gera um protocolo único para a ocorrência
   * Formato: OC-YYYYMMDD-XXXX (Ex: OC-20231201-0001)
   */
  private async generateProtocol(): Promise<string> {
    const today = moment().format('YYYYMMDD');
    const prefix = `OC-${today}`;
    
    // Busca o último protocolo do dia
    const lastOccurrence = await this.prisma.occurrence.findFirst({
      where: {
        protocol: {
          startsWith: prefix,
        },
      },
      orderBy: {
        protocol: 'desc',
      },
    });

    let sequence = 1;
    if (lastOccurrence) {
      const lastSequence = parseInt(lastOccurrence.protocol.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `${prefix}-${sequence.toString().padStart(4, '0')}`;
  }

  /**
   * Cria uma nova ocorrência
   */
  async create(createOccurrenceDto: CreateOccurrenceDto, userId: string, condominiumId: string) {
    try {
      // Verifica se o usuário existe
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new BadRequestException('Usuário não encontrado');
      }

      const protocol = await this.generateProtocol();

      const occurrence = await this.prisma.occurrence.create({
        data: {
          ...createOccurrenceDto,
          protocol,
          createdById: userId,
          condominiumId,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              apartment: true,
              role: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          attachments: true,
          _count: {
            select: {
              attachments: true,
              statusHistory: true,
            },
          },
        },
      });

      // Cria histórico inicial de status
      await this.prisma.occurrenceStatusHistory.create({
        data: {
          occurrenceId: occurrence.id,
          status: OccurrenceStatus.ABERTA,
          comment: 'Ocorrência criada',
          changedById: userId,
        },
      });

      return occurrence;
    } catch (error) {
      throw new BadRequestException(`Erro ao criar ocorrência: ${error.message}`);
    }
  }

  /**
   * Lista ocorrências com filtros e paginação
   */
  async findAll(query: QueryOccurrenceDto, condominiumId: string) {
    const { page, limit, status, type, priority, search, createdById, assignedToId } = query;
    
    const skip = (page - 1) * limit;
    
    // Monta filtros dinâmicos
    const where: any = {
      condominiumId,
    };

    if (status) where.status = status;
    if (type) where.type = type;
    if (priority) where.priority = priority;
    if (createdById) where.createdById = createdById;
    if (assignedToId) where.assignedToId = assignedToId;
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { protocol: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [occurrences, total] = await Promise.all([
      this.prisma.occurrence.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              apartment: true,
              role: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          _count: {
            select: {
              attachments: true,
              statusHistory: true,
            },
          },
        },
      }),
      this.prisma.occurrence.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: occurrences,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Busca uma ocorrência por ID
   */
  async findOne(id: string, condominiumId: string) {
    const occurrence = await this.prisma.occurrence.findFirst({
      where: {
        id,
        condominiumId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            apartment: true,
            role: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        attachments: {
          include: {
            uploadedBy: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
        statusHistory: {
          include: {
            changedBy: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!occurrence) {
      throw new NotFoundException('Ocorrência não encontrada');
    }

    return occurrence;
  }

  /**
   * Atualiza uma ocorrência
   */
  async update(id: string, updateOccurrenceDto: UpdateOccurrenceDto, userId: string, condominiumId: string) {
    const currentOccurrence = await this.findOne(id, condominiumId);
    
    const { status, ...updateData } = updateOccurrenceDto;

    try {
      const occurrence = await this.prisma.occurrence.update({
        where: { id },
        data: {
          ...updateData,
          ...(status && { status }),
          ...(status === OccurrenceStatus.RESOLVIDA && { resolvedAt: new Date() }),
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              apartment: true,
              role: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          _count: {
            select: {
              attachments: true,
              statusHistory: true,
            },
          },
        },
      });

      // Adiciona histórico se o status foi alterado
      if (status && status !== currentOccurrence.status) {
        await this.prisma.occurrenceStatusHistory.create({
          data: {
            occurrenceId: id,
            status,
            comment: `Status alterado de ${currentOccurrence.status} para ${status}`,
            changedById: userId,
          },
        });
      }

      return occurrence;
    } catch (error) {
      throw new BadRequestException(`Erro ao atualizar ocorrência: ${error.message}`);
    }
  }

  /**
   * Remove uma ocorrência (soft delete)
   */
  async remove(id: string, condominiumId: string) {
    const occurrence = await this.findOne(id, condominiumId);
    
    try {
      await this.prisma.occurrence.delete({
        where: { id },
      });

      return { message: 'Ocorrência removida com sucesso' };
    } catch (error) {
      throw new BadRequestException(`Erro ao remover ocorrência: ${error.message}`);
    }
  }

  /**
   * Obtém estatísticas das ocorrências
   */
  async getStatistics(condominiumId: string) {
    const [
      total,
      aberta,
      emAndamento,
      resolvida,
      byType,
      byPriority,
      recentOccurrences,
    ] = await Promise.all([
      this.prisma.occurrence.count({ where: { condominiumId } }),
      this.prisma.occurrence.count({ where: { condominiumId, status: OccurrenceStatus.ABERTA } }),
      this.prisma.occurrence.count({ where: { condominiumId, status: OccurrenceStatus.EM_ANDAMENTO } }),
      this.prisma.occurrence.count({ where: { condominiumId, status: OccurrenceStatus.RESOLVIDA } }),
      
      this.prisma.occurrence.groupBy({
        by: ['type'],
        where: { condominiumId },
        _count: { type: true },
      }),
      
      this.prisma.occurrence.groupBy({
        by: ['priority'],
        where: { condominiumId },
        _count: { priority: true },
      }),

      this.prisma.occurrence.findMany({
        where: { condominiumId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              name: true,
              apartment: true,
            },
          },
        },
      }),
    ]);

    return {
      total,
      byStatus: {
        aberta,
        emAndamento,
        resolvida,
        cancelada: total - aberta - emAndamento - resolvida,
      },
      byType,
      byPriority,
      recentOccurrences,
    };
  }
}