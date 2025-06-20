import { Module } from '@nestjs/common';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';

@Module({
  providers: [SeatService],
  controllers: [SeatController],
})
export class SeatModule {}
