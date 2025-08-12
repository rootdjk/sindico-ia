import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { OccurrencesService } from './occurrences.service';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';
import { QueryOccurrenceDto } from './dto/query-occurrence.dto';

// Simulando um guard de autenticação (seria implementado no módulo de auth)
// @UseGuards(JwtAuthGuard)

@ApiTags('Ocorrências')
@ApiBearerAuth()
@Controller('occurrences')
export class OccurrencesController {
  constructor(private readonly occurrencesService: OccurrencesService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Criar nova ocorrência',
    description: 'Cria uma nova ocorrência no sistema com protocolo único gerado automaticamente'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Ocorrência criada com sucesso',
    schema: {
      example: {
        id: 'clp123456789',
        protocol: 'OC-20231201-0001',
        title: 'Problema no elevador',
        description: 'Elevador fazendo ruídos estranhos',
        type: 'ELEVADOR',
        priority: 'ALTA',
        status: 'ABERTA',
        location: 'Bloco A',
        createdAt: '2023-12-01T10:00:00.000Z',
        createdBy: {
          id: 'user123',
          name: 'João Silva',
          email: 'joao@email.com',
          apartment: '101',
          role: 'MORADOR'
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dados inválidos ou erro de validação' 
  })
  create(@Body() createOccurrenceDto: CreateOccurrenceDto, @Request() req: any) {
    // Em produção, userId e condominiumId viriam do token JWT
    const userId = req.user?.id || 'demo-user-id';
    const condominiumId = req.user?.condominiumId || 'demo-condominium-id';
    
    return this.occurrencesService.create(createOccurrenceDto, userId, condominiumId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar ocorrências', 
    description: 'Lista todas as ocorrências com filtros e paginação'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Página para paginação', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página', example: 10 })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por status', enum: ['ABERTA', 'EM_ANDAMENTO', 'RESOLVIDA', 'CANCELADA'] })
  @ApiQuery({ name: 'type', required: false, description: 'Filtrar por tipo', enum: ['MANUTENCAO', 'SEGURANCA', 'RUIDO', 'LIMPEZA', 'ELEVADOR', 'PORTARIA', 'VAGA_GARAGEM', 'OBRA_REFORMA', 'ANIMAL', 'OUTROS'] })
  @ApiQuery({ name: 'priority', required: false, description: 'Filtrar por prioridade', enum: ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'] })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por termo no título ou descrição' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de ocorrências recuperada com sucesso',
    schema: {
      example: {
        data: [
          {
            id: 'clp123456789',
            protocol: 'OC-20231201-0001',
            title: 'Problema no elevador',
            status: 'ABERTA',
            priority: 'ALTA',
            createdAt: '2023-12-01T10:00:00.000Z',
            createdBy: {
              name: 'João Silva',
              apartment: '101'
            }
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      }
    }
  })
  findAll(@Query() query: QueryOccurrenceDto, @Request() req: any) {
    const condominiumId = req.user?.condominiumId || 'demo-condominium-id';
    return this.occurrencesService.findAll(query, condominiumId);
  }

  @Get('statistics')
  @ApiOperation({ 
    summary: 'Estatísticas das ocorrências',
    description: 'Retorna estatísticas gerais das ocorrências do condomínio'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Estatísticas recuperadas com sucesso',
    schema: {
      example: {
        total: 156,
        byStatus: {
          aberta: 45,
          emAndamento: 23,
          resolvida: 85,
          cancelada: 3
        },
        byType: [
          { type: 'ELEVADOR', _count: { type: 25 } },
          { type: 'MANUTENCAO', _count: { type: 45 } }
        ],
        byPriority: [
          { priority: 'ALTA', _count: { priority: 30 } },
          { priority: 'MEDIA', _count: { priority: 85 } }
        ],
        recentOccurrences: []
      }
    }
  })
  getStatistics(@Request() req: any) {
    const condominiumId = req.user?.condominiumId || 'demo-condominium-id';
    return this.occurrencesService.getStatistics(condominiumId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar ocorrência por ID',
    description: 'Retorna uma ocorrência específica com todos os detalhes, anexos e histórico'
  })
  @ApiParam({ name: 'id', description: 'ID da ocorrência', example: 'clp123456789' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Ocorrência encontrada com sucesso',
    schema: {
      example: {
        id: 'clp123456789',
        protocol: 'OC-20231201-0001',
        title: 'Problema no elevador',
        description: 'Elevador fazendo ruídos estranhos',
        type: 'ELEVADOR',
        priority: 'ALTA',
        status: 'ABERTA',
        location: 'Bloco A',
        createdAt: '2023-12-01T10:00:00.000Z',
        attachments: [],
        statusHistory: [
          {
            status: 'ABERTA',
            comment: 'Ocorrência criada',
            createdAt: '2023-12-01T10:00:00.000Z',
            changedBy: { name: 'João Silva' }
          }
        ]
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Ocorrência não encontrada' 
  })
  findOne(@Param('id') id: string, @Request() req: any) {
    const condominiumId = req.user?.condominiumId || 'demo-condominium-id';
    return this.occurrencesService.findOne(id, condominiumId);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualizar ocorrência',
    description: 'Atualiza dados de uma ocorrência existente'
  })
  @ApiParam({ name: 'id', description: 'ID da ocorrência', example: 'clp123456789' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Ocorrência atualizada com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Ocorrência não encontrada' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dados inválidos' 
  })
  update(
    @Param('id') id: string,
    @Body() updateOccurrenceDto: UpdateOccurrenceDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id || 'demo-user-id';
    const condominiumId = req.user?.condominiumId || 'demo-condominium-id';
    
    return this.occurrencesService.update(id, updateOccurrenceDto, userId, condominiumId);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Remover ocorrência',
    description: 'Remove permanentemente uma ocorrência do sistema'
  })
  @ApiParam({ name: 'id', description: 'ID da ocorrência', example: 'clp123456789' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Ocorrência removida com sucesso',
    schema: {
      example: {
        message: 'Ocorrência removida com sucesso'
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Ocorrência não encontrada' 
  })
  remove(@Param('id') id: string, @Request() req: any) {
    const condominiumId = req.user?.condominiumId || 'demo-condominium-id';
    return this.occurrencesService.remove(id, condominiumId);
  }
}