import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

import { bus } from 'src/bus/bus.schema';
import { Routs } from 'src/BusRoutes/Route.schema';
import { Types } from 'mongoose';

Schema();
export class Schedule {
  @Prop({ type: Types.ObjectId, ref: typeof bus, require: true })
  busId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: typeof Routs, require: true })
  routId: Types.ObjectId;
  @Prop()
  depatureTime: Date;
  @Prop()
  arrivalTime: Date;
}

export const scheduleSchema = SchemaFactory.createForClass(Schedule);
