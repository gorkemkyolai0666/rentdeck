import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ShopService } from './shop.service';
import { UpdateShopDto } from './dto/update-shop.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('shop')
@UseGuards(JwtAuthGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  get(@Request() req: { user: { shopId: string } }) {
    return this.shopService.get(req.user.shopId);
  }

  @Patch()
  update(
    @Request() req: { user: { shopId: string } },
    @Body() dto: UpdateShopDto,
  ) {
    return this.shopService.update(req.user.shopId, dto);
  }
}
