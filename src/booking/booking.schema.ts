import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../user/User.schema';
import { Schedule } from '../schedule/schedule.schema';
import { Document } from 'mongoose';

export type BookingDocument = booking & Document;

export enum BookingStatus {
  BOOKED = 'booked',
  CANCELED = 'canceled',
}
@Schema()
export class booking {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Schedule.name, required: true })
  scheduleId: Types.ObjectId;

  @Prop({ default: Date.now })
  bookingDate: Date;

  @Prop({
    type: String,
    enum: BookingStatus,
    default: BookingStatus.BOOKED,
  })
  status: BookingStatus;

  seatNumber: string;
}

export const BookingSchema = SchemaFactory.createForClass(booking);
