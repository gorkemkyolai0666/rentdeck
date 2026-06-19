import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(shopId: string) {
    return this.prisma.equipment.findMany({
      where: { shopId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, shopId: string) {
    const item = await this.prisma.equipment.findFirst({ where: { id, shopId } });
    if (!item) throw new NotFoundException('Ekipman bulunamadı');
    return item;
  }

  create(dto: CreateEquipmentDto, shopId: string) {
    return this.prisma.equipment.create({
      data: {
        name: dto.name,
        type: dto.type,
        brand: dto.brand || '',
        size: dto.size || '',
        condition: dto.condition || 'good',
        status: dto.status || 'available',
        dailyRate: dto.dailyRate ?? 0,
        notes: dto.notes || '',
        shopId,
      },
    });
  }

  async update(id: string, dto: UpdateEquipmentDto, shopId: string) {
    const item = await this.prisma.equipment.findFirst({ where: { id, shopId } });
    if (!item) throw new NotFoundException('Ekipman bulunamadı');
    return this.prisma.equipment.update({ where: { id }, data: dto });
  }

  async remove(id: string, shopId: string) {
    const item = await this.prisma.equipment.findFirst({ where: { id, shopId } });
    if (!item) throw new NotFoundException('Ekipman bulunamadı');
    return this.prisma.equipment.delete({ where: { id } });
  }
}
