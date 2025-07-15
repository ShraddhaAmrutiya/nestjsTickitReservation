import { Module } from '@nestjs/common';
import { StopController } from './stop.controller';
import { StopService } from './stop.service';
import { stop, stopSchema } from './stop.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: stop.name, schema: stopSchema }]),
  ],

  controllers: [StopController],
  providers: [StopService],
})
export class StopModule {}
