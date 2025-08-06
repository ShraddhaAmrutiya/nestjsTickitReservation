import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutSchema, Routs } from '../BusRoutes/Route.schema';
import { BusSchema, bus } from '../bus/bus.schema';
import { scheduleSchema, Schedule } from './schedule.schema';
import {
  ScheduleSeat,
  ScheduleSeatSchema,
} from '../schedule-seat/schedule-seat.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: scheduleSchema },
      { name: Routs.name, schema: RoutSchema },
      { name: bus.name, schema: BusSchema },
      { name: ScheduleSeat.name, schema: ScheduleSeatSchema },
    ]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
