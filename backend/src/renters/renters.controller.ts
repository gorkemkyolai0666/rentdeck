import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RentersService } from './renters.service';
import { CreateRenterDto } from './dto/create-renter.dto';
import { UpdateRenterDto } from './dto/update-renter.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('renters')
@UseGuards(JwtAuthGuard)
export class RentersController {
  constructor(private readonly rentersService: RentersService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.rentersService.findAll(req.user.shopId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.rentersService.findOne(id, req.user.shopId);
  }

  @Post()
  create(@Body() dto: CreateRenterDto, @Request() req: any) {
    return this.rentersService.create(dto, req.user.shopId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRenterDto, @Request() req: any) {
    return this.rentersService.update(id, dto, req.user.shopId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.rentersService.remove(id, req.user.shopId);
  }
}
