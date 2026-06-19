import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { RentersModule } from './renters/renters.module';
import { TuneJobsModule } from './tune-jobs/tune-jobs.module';
import { RentalsModule } from './rentals/rentals.module';
import { RentalPackagesModule } from './rental-packages/rental-packages.module';
import { EquipmentModule } from './equipment/equipment.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ShopModule } from './shop/shop.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    HealthModule,
    RentersModule,
    TuneJobsModule,
    RentalsModule,
    RentalPackagesModule,
    EquipmentModule,
    DashboardModule,
    ShopModule,
  ],
})
export class AppModule {}
