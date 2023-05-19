import { Module } from '@nestjs/common';
import { TracerService } from './tracer.service';

@Module({
  providers: [TracerService],
  exports: [TracerService],
})
export class TracerModule {}
