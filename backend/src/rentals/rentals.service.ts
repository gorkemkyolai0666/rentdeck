import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';

@Injectable()
export class RentalsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(shopId: string) {
    return this.prisma.rental.findMany({
      where: { shopId },
      include: { renter: true, equipment: true, package: true },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: string, shopId: string) {
    const rental = await this.prisma.rental.findFirst({
      where: { id, shopId },
      include: { renter: true, equipment: true, package: true },
    });
    if (!rental) throw new NotFoundException('Kiralama bulunamadı');
    return rental;
  }

  create(dto: CreateRentalDto, shopId: string) {
    return this.prisma.rental.create({
      data: {
        renterId: dto.renterId,
        equipmentId: dto.equipmentId || null,
        packageId: dto.packageId || null,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        status: dto.status || 'active',
        totalPrice: dto.totalPrice ?? 0,
        depositPaid: dto.depositPaid ?? 0,
        notes: dto.notes || '',
        shopId,
      },
      include: { renter: true, equipment: true, package: true },
    });
  }

  async update(id: string, dto: UpdateRentalDto, shopId: string) {
    const rental = await this.prisma.rental.findFirst({ where: { id, shopId } });
    if (!rental) throw new NotFoundException('Kiralama bulunamadı');
    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    return this.prisma.rental.update({
      where: { id },
      data,
      include: { renter: true, equipment: true, package: true },
    });
  }

  async remove(id: string, shopId: string) {
    const rental = await this.prisma.rental.findFirst({ where: { id, shopId } });
    if (!rental) throw new NotFoundException('Kiralama bulunamadı');
    return this.prisma.rental.delete({ where: { id } });
  }
}
