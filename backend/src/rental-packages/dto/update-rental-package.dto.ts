import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { PackageDuration } from '@prisma/client';

export class UpdateRentalPackageDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(PackageDuration)
  duration?: PackageDuration;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  depositAmount?: number;
}
