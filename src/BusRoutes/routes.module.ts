import { Module } from '@nestjs/common';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutSchema, Routs } from './Route.schema';
import { stop, stopSchema } from '../stop/stop.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Routs.name, schema: RoutSchema },
      { name: stop.name, schema: stopSchema },
    ]),
  ],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
