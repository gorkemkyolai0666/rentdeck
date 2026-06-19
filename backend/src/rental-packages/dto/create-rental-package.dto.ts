import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { PackageDuration } from '@prisma/client';

export class CreateRentalPackageDto {
  @IsString()
  name: string;

  @IsEnum(PackageDuration)
  duration: PackageDuration;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  depositAmount?: number;
}
