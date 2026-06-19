import { Module } from '@nestjs/common';
import { RentalPackagesController } from './rental-packages.controller';
import { RentalPackagesService } from './rental-packages.service';

@Module({
  controllers: [RentalPackagesController],
  providers: [RentalPackagesService],
})
export class RentalPackagesModule {}
