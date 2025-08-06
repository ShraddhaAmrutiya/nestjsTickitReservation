import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleSeatService } from './schedule-seat.service';
import { ScheduleSeatController } from './schedule-seat.controller';
import { ScheduleSeat, ScheduleSeatSchema } from './schedule-seat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScheduleSeat.name, schema: ScheduleSeatSchema },
    ]),
  ],
  controllers: [ScheduleSeatController],
  providers: [ScheduleSeatService],
  exports: [ScheduleSeatService],
})
export class ScheduleSeatModule {}
