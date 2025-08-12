import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { OccurrenceType, OccurrencePriority } from '@prisma/client';

export class CreateOccurrenceDto {
  @ApiProperty({
    description: 'Título da ocorrência',
    example: 'Problema no elevador',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Descrição detalhada da ocorrência',
    example: 'O elevador do bloco A está fazendo ruídos estranhos e parando entre andares',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    description: 'Tipo da ocorrência',
    enum: OccurrenceType,
    example: OccurrenceType.ELEVADOR,
  })
  @IsEnum(OccurrenceType)
  type: OccurrenceType;

  @ApiProperty({
    description: 'Prioridade da ocorrência',
    enum: OccurrencePriority,
    example: OccurrencePriority.ALTA,
    required: false,
  })
  @IsOptional()
  @IsEnum(OccurrencePriority)
  priority?: OccurrencePriority;

  @ApiProperty({
    description: 'Localização específica da ocorrência',
    example: 'Bloco A, Térreo',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;
}