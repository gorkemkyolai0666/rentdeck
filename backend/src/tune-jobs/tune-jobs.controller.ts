import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TuneJobsService } from './tune-jobs.service';
import { CreateTuneJobDto } from './dto/create-tune-job.dto';
import { UpdateTuneJobDto } from './dto/update-tune-job.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tune-jobs')
@UseGuards(JwtAuthGuard)
export class TuneJobsController {
  constructor(private readonly tuneJobsService: TuneJobsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.tuneJobsService.findAll(req.user.shopId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.tuneJobsService.findOne(id, req.user.shopId);
  }

  @Post()
  create(@Body() dto: CreateTuneJobDto, @Request() req: any) {
    return this.tuneJobsService.create(dto, req.user.shopId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTuneJobDto, @Request() req: any) {
    return this.tuneJobsService.update(id, dto, req.user.shopId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.tuneJobsService.remove(id, req.user.shopId);
  }
}
