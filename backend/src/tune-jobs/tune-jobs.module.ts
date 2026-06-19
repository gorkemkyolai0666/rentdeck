import { Module } from '@nestjs/common';
import { TuneJobsController } from './tune-jobs.controller';
import { TuneJobsService } from './tune-jobs.service';

@Module({
  controllers: [TuneJobsController],
  providers: [TuneJobsService],
})
export class TuneJobsModule {}
