import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(shopId: string) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000);
    const weekEnd = new Date(todayStart.getTime() + 7 * 86400000);

    const [
      totalRenters,
      todayTuneJobs,
      weekTuneJobs,
      activeRentals,
      overdueRentals,
      totalRentals,
      maintenanceEquipment,
      recentRenters,
      upcomingTuneJobs,
    ] = await Promise.all([
      this.prisma.renter.count({ where: { shopId } }),
      this.prisma.tuneJob.count({
        where: { shopId, scheduledAt: { gte: todayStart, lt: todayEnd } },
      }),
      this.prisma.tuneJob.count({
        where: { shopId, scheduledAt: { gte: todayStart, lt: weekEnd } },
      }),
      this.prisma.rental.count({
        where: { shopId, status: { in: ['active', 'reserved'] } },
      }),
      this.prisma.rental.count({
        where: { shopId, status: 'overdue' },
      }),
      this.prisma.rental.count({ where: { shopId } }),
      this.prisma.equipment.count({
        where: { shopId, status: { in: ['maintenance', 'rented'] } },
      }),
      this.prisma.renter.findMany({
        where: { shopId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.tuneJob.findMany({
        where: {
          shopId,
          scheduledAt: { gte: todayStart },
          status: { in: ['scheduled', 'in_progress'] },
        },
        include: { renter: true },
        orderBy: { scheduledAt: 'asc' },
        take: 5,
      }),
    ]);

    return {
      totalRenters,
      todayTuneJobs,
      weekTuneJobs,
      activeRentals,
      overdueRentals,
      totalRentals,
      maintenanceEquipment,
      recentRenters,
      upcomingTuneJobs,
    };
  }
}
