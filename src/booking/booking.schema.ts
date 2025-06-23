import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/User.schema';
// import { bus } from 'src/bus/bus.schema';
import { Schedule } from 'src/schedule/schedule.schema';
@Schema()
export class booking {
  @Prop({ type: Types.ObjectId, ref: typeof User, required: true })
  userId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: typeof Schedule, required: true })
  routsId: Types.ObjectId;
  // @Prop({ type: Types.ObjectId, ref: typeof seat, required: true })
  // seatId: Types.ObjectId;
  @Prop()
  bookingDate: Date;
}

export const BookingSchema = SchemaFactory.createForClass(booking);
