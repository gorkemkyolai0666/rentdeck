import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RentalPackagesService } from './rental-packages.service';
import { CreateRentalPackageDto } from './dto/create-rental-package.dto';
import { UpdateRentalPackageDto } from './dto/update-rental-package.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rental-packages')
@UseGuards(JwtAuthGuard)
export class RentalPackagesController {
  constructor(private readonly rentalPackagesService: RentalPackagesService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.rentalPackagesService.findAll(req.user.shopId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.rentalPackagesService.findOne(id, req.user.shopId);
  }

  @Post()
  create(@Body() dto: CreateRentalPackageDto, @Request() req: any) {
    return this.rentalPackagesService.create(dto, req.user.shopId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRentalPackageDto, @Request() req: any) {
    return this.rentalPackagesService.update(id, dto, req.user.shopId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.rentalPackagesService.remove(id, req.user.shopId);
  }
}
