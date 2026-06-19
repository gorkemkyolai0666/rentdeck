import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTuneJobDto } from './dto/create-tune-job.dto';
import { UpdateTuneJobDto } from './dto/update-tune-job.dto';

@Injectable()
export class TuneJobsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(shopId: string) {
    return this.prisma.tuneJob.findMany({
      where: { shopId },
      include: { renter: true, equipment: true },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findOne(id: string, shopId: string) {
    const job = await this.prisma.tuneJob.findFirst({
      where: { id, shopId },
      include: { renter: true, equipment: true },
    });
    if (!job) throw new NotFoundException('Bakım işi bulunamadı');
    return job;
  }

  create(dto: CreateTuneJobDto, shopId: string) {
    return this.prisma.tuneJob.create({
      data: {
        renterId: dto.renterId,
        equipmentId: dto.equipmentId || null,
        scheduledAt: new Date(dto.scheduledAt),
        type: dto.type,
        status: dto.status || 'scheduled',
        technician: dto.technician || '',
        notes: dto.notes || '',
        shopId,
      },
      include: { renter: true, equipment: true },
    });
  }

  async update(id: string, dto: UpdateTuneJobDto, shopId: string) {
    const job = await this.prisma.tuneJob.findFirst({ where: { id, shopId } });
    if (!job) throw new NotFoundException('Bakım işi bulunamadı');
    const data: any = { ...dto };
    if (dto.scheduledAt) data.scheduledAt = new Date(dto.scheduledAt);
    return this.prisma.tuneJob.update({
      where: { id },
      data,
      include: { renter: true, equipment: true },
    });
  }

  async remove(id: string, shopId: string) {
    const job = await this.prisma.tuneJob.findFirst({ where: { id, shopId } });
    if (!job) throw new NotFoundException('Bakım işi bulunamadı');
    return this.prisma.tuneJob.delete({ where: { id } });
  }
}
