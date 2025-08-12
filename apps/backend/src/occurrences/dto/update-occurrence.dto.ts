import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateOccurrenceDto } from './create-occurrence.dto';
import { OccurrenceStatus } from '@prisma/client';

export class UpdateOccurrenceDto extends PartialType(CreateOccurrenceDto) {
  @ApiProperty({
    description: 'Status da ocorrência',
    enum: OccurrenceStatus,
    example: OccurrenceStatus.EM_ANDAMENTO,
    required: false,
  })
  @IsOptional()
  @IsEnum(OccurrenceStatus)
  status?: OccurrenceStatus;

  @ApiProperty({
    description: 'Observações internas (visível apenas para administradores)',
    example: 'Técnico agendado para amanhã às 14h',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  internalNotes?: string;

  @ApiProperty({
    description: 'ID do usuário responsável pela ocorrência',
    example: 'clp123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  assignedToId?: string;
}