import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRentalPackageDto } from './dto/create-rental-package.dto';
import { UpdateRentalPackageDto } from './dto/update-rental-package.dto';

@Injectable()
export class RentalPackagesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(shopId: string) {
    return this.prisma.rentalPackage.findMany({
      where: { shopId },
      orderBy: { price: 'asc' },
    });
  }

  async findOne(id: string, shopId: string) {
    const pkg = await this.prisma.rentalPackage.findFirst({ where: { id, shopId } });
    if (!pkg) throw new NotFoundException('Kiralama paketi bulunamadı');
    return pkg;
  }

  create(dto: CreateRentalPackageDto, shopId: string) {
    return this.prisma.rentalPackage.create({
      data: {
        name: dto.name,
        duration: dto.duration,
        price: dto.price,
        description: dto.description || '',
        depositAmount: dto.depositAmount ?? 0,
        shopId,
      },
    });
  }

  async update(id: string, dto: UpdateRentalPackageDto, shopId: string) {
    const pkg = await this.prisma.rentalPackage.findFirst({ where: { id, shopId } });
    if (!pkg) throw new NotFoundException('Kiralama paketi bulunamadı');
    return this.prisma.rentalPackage.update({ where: { id }, data: dto });
  }

  async remove(id: string, shopId: string) {
    const pkg = await this.prisma.rentalPackage.findFirst({ where: { id, shopId } });
    if (!pkg) throw new NotFoundException('Kiralama paketi bulunamadı');
    return this.prisma.rentalPackage.delete({ where: { id } });
  }
}
