// import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
// import { Types } from 'mongoose';
// import { User } from '../user/User.schema';
// import { Schedule } from '../schedule/schedule.schema';
// import { Document } from 'mongoose';

// export type BookingDocument = booking & Document;

// export enum BookingStatus {
//   BOOKED = 'booked',
//   CANCELED = 'canceled',
// }
// @Schema()
// export class booking {
//   @Prop({ type: Types.ObjectId, ref: User.name, required: true })
//   userId: Types.ObjectId;

//   @Prop({ type: Types.ObjectId, ref: Schedule.name, required: true })
//   scheduleId: Types.ObjectId;

//   @Prop({ default: Date.now })
//   bookingDate: Date;

//   @Prop({
//     type: String,
//     enum: BookingStatus,
//     default: BookingStatus.BOOKED,
//   })
//   status: BookingStatus;

//   seatNumber: string;
// }

// export const BookingSchema = SchemaFactory.createForClass(booking);

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { User } from '../user/User.schema';
import { Schedule } from '../schedule/schedule.schema';

export enum BookingStatus {
  BOOKED = 'booked',
  CANCELED = 'canceled',
}

export class SingleBooking {
  _id?: Types.ObjectId;
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

  @Prop({ required: true })
  seatNumber: string;
}

@Schema()
export class BookingGroup {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        scheduleId: {
          type: Types.ObjectId,
          ref: Schedule.name,
          required: true,
        },
        bookingDate: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: BookingStatus,
          default: BookingStatus.BOOKED,
        },
        seatNumber: { type: String, required: true },
      },
    ],
    default: [],
  })
  bookings: SingleBooking[];
}

export type BookingGroupDocument = BookingGroup & Document;
export const BookingSchema = SchemaFactory.createForClass(BookingGroup);
