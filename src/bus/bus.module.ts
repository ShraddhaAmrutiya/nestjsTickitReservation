import { Module } from '@nestjs/common';
import { BusController } from './bus.controller';
import { BusService } from './bus.service';
import { MongooseModule } from '@nestjs/mongoose';
import { bus, BusSchema } from './bus.schema';
import { Schedule, scheduleSchema } from '../schedule/schedule.schema';
import {
  ScheduleSeat,
  ScheduleSeatSchema,
} from '../schedule-seat/schedule-seat.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: bus.name, schema: BusSchema },
      { name: Schedule.name, schema: scheduleSchema },
      { name: ScheduleSeat.name, schema: ScheduleSeatSchema },
    ]),
  ],
  controllers: [BusController],
  providers: [BusService],
})
export class BusModule {}
