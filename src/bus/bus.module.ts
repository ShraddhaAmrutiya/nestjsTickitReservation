import { Module } from '@nestjs/common';
import { BusController } from './bus.controller';
import { BusService } from './bus.service';
import { MongooseModule } from '@nestjs/mongoose';
import { bus, BusSchema } from './bus.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: bus.name, schema: BusSchema }])],
  controllers: [BusController],
  providers: [BusService],
})
export class BusModule {}
