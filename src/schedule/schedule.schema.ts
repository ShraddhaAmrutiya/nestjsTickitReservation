import {
  Prop,
  SchemaFactory,
  Schema as MongooseSchema,
} from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ScheduleDocument = Schedule & Document;

@MongooseSchema()
export class Schedule {
  @Prop({ type: Types.ObjectId, ref: 'bus', required: true })
  busId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Routs', required: true })
  routId: Types.ObjectId;

  @Prop()
  departureTime: Date;

  @Prop()
  arrivalTime: Date;
}

export const scheduleSchema = SchemaFactory.createForClass(Schedule);
