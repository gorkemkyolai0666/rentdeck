import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('equipment')
@UseGuards(JwtAuthGuard)
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.equipmentService.findAll(req.user.shopId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.equipmentService.findOne(id, req.user.shopId);
  }

  @Post()
  create(@Body() dto: CreateEquipmentDto, @Request() req: any) {
    return this.equipmentService.create(dto, req.user.shopId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEquipmentDto, @Request() req: any) {
    return this.equipmentService.update(id, dto, req.user.shopId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.equipmentService.remove(id, req.user.shopId);
  }
}
