import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TuneJobType, TuneJobStatus } from '@prisma/client';

export class CreateTuneJobDto {
  @IsString()
  renterId: string;

  @IsOptional()
  @IsString()
  equipmentId?: string;

  @IsDateString()
  scheduledAt: string;

  @IsEnum(TuneJobType)
  type: TuneJobType;

  @IsOptional()
  @IsEnum(TuneJobStatus)
  status?: TuneJobStatus;

  @IsOptional()
  @IsString()
  technician?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
