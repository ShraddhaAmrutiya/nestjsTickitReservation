import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutSchema, Routs } from 'src/BusRoutes/Route.schema';
import { BusSchema, bus } from 'src/bus/bus.schema';
import { scheduleSchema, Schedule } from './schedule.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: scheduleSchema },
      { name: Routs.name, schema: RoutSchema },
      { name: bus.name, schema: BusSchema },
    ]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
