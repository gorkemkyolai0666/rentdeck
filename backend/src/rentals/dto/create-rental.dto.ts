import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { RentalStatus } from '@prisma/client';

export class CreateRentalDto {
  @IsString()
  renterId: string;

  @IsOptional()
  @IsString()
  equipmentId?: string;

  @IsOptional()
  @IsString()
  packageId?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(RentalStatus)
  status?: RentalStatus;

  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @IsNumber()
  depositPaid?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
