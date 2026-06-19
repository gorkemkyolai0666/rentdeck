import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rentals')
@UseGuards(JwtAuthGuard)
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.rentalsService.findAll(req.user.shopId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.rentalsService.findOne(id, req.user.shopId);
  }

  @Post()
  create(@Body() dto: CreateRentalDto, @Request() req: any) {
    return this.rentalsService.create(dto, req.user.shopId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRentalDto, @Request() req: any) {
    return this.rentalsService.update(id, dto, req.user.shopId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.rentalsService.remove(id, req.user.shopId);
  }
}
