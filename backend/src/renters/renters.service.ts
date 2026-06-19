import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRenterDto } from './dto/create-renter.dto';
import { UpdateRenterDto } from './dto/update-renter.dto';

@Injectable()
export class RentersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(shopId: string) {
    return this.prisma.renter.findMany({
      where: { shopId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, shopId: string) {
    const renter = await this.prisma.renter.findFirst({
      where: { id, shopId },
      include: {
        rentals: { orderBy: { startDate: 'desc' }, take: 5 },
        tuneJobs: { orderBy: { scheduledAt: 'desc' }, take: 5 },
      },
    });
    if (!renter) throw new NotFoundException('Kiracı bulunamadı');
    return renter;
  }

  create(dto: CreateRenterDto, shopId: string) {
    return this.prisma.renter.create({
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        email: dto.email || '',
        bootSize: dto.bootSize || '',
        skillLevel: dto.skillLevel || 'intermediate',
        notes: dto.notes || '',
        shopId,
      },
    });
  }

  async update(id: string, dto: UpdateRenterDto, shopId: string) {
    const renter = await this.prisma.renter.findFirst({ where: { id, shopId } });
    if (!renter) throw new NotFoundException('Kiracı bulunamadı');
    return this.prisma.renter.update({ where: { id }, data: dto });
  }

  async remove(id: string, shopId: string) {
    const renter = await this.prisma.renter.findFirst({ where: { id, shopId } });
    if (!renter) throw new NotFoundException('Kiracı bulunamadı');
    await this.prisma.rental.deleteMany({ where: { renterId: id } });
    await this.prisma.tuneJob.deleteMany({ where: { renterId: id } });
    return this.prisma.renter.delete({ where: { id } });
  }
}
