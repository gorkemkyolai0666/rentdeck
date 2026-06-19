import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TuneJobType, TuneJobStatus } from '@prisma/client';

export class UpdateTuneJobDto {
  @IsOptional()
  @IsString()
  renterId?: string;

  @IsOptional()
  @IsString()
  equipmentId?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(TuneJobType)
  type?: TuneJobType;

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
