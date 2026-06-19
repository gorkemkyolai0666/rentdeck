import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateShopDto } from './dto/update-shop.dto';

@Injectable()
export class ShopService {
  constructor(private readonly prisma: PrismaService) {}

  get(shopId: string) {
    return this.prisma.rentShop.findUnique({ where: { id: shopId } });
  }

  update(shopId: string, dto: UpdateShopDto) {
    return this.prisma.rentShop.update({ where: { id: shopId }, data: dto });
  }
}
