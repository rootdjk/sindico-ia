import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { OccurrenceStatus, OccurrenceType, OccurrencePriority } from '@prisma/client';

export class QueryOccurrenceDto {
  @ApiProperty({
    description: 'Página para paginação',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Número de itens por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    description: 'Filtrar por status',
    enum: OccurrenceStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(OccurrenceStatus)
  status?: OccurrenceStatus;

  @ApiProperty({
    description: 'Filtrar por tipo',
    enum: OccurrenceType,
    required: false,
  })
  @IsOptional()
  @IsEnum(OccurrenceType)
  type?: OccurrenceType;

  @ApiProperty({
    description: 'Filtrar por prioridade',
    enum: OccurrencePriority,
    required: false,
  })
  @IsOptional()
  @IsEnum(OccurrencePriority)
  priority?: OccurrencePriority;

  @ApiProperty({
    description: 'Buscar por termo no título ou descrição',
    example: 'elevador',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filtrar por usuário criador',
    example: 'clp123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  createdById?: string;

  @ApiProperty({
    description: 'Filtrar por usuário responsável',
    example: 'clp123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  assignedToId?: string;
}