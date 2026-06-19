import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { EquipmentType, EquipmentCondition, EquipmentStatus } from '@prisma/client';

export class CreateEquipmentDto {
  @IsString()
  name: string;

  @IsEnum(EquipmentType)
  type: EquipmentType;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsEnum(EquipmentCondition)
  condition?: EquipmentCondition;

  @IsOptional()
  @IsEnum(EquipmentStatus)
  status?: EquipmentStatus;

  @IsOptional()
  @IsNumber()
  dailyRate?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
