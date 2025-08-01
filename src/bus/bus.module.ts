import { Module } from '@nestjs/common';
import { BusController } from './bus.controller';
import { BusService } from './bus.service';
import { MongooseModule } from '@nestjs/mongoose';
import { bus, BusSchema } from './bus.schema';
import { Schedule, scheduleSchema } from '../schedule/schedule.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: bus.name, schema: BusSchema },
      { name: Schedule.name, schema: scheduleSchema },
    ]),
  ],
  controllers: [BusController],
  providers: [BusService],
})
export class BusModule {}
