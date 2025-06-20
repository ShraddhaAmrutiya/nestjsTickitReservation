import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { bus } from 'src/bus/bus.schema';
import { Types } from 'mongoose';

@Schema()
export class seat {
  @Prop()
  seatNo: number;
  @Prop()
  IsBooked: boolean;
  @Prop({ type: Types.ObjectId, ref: typeof bus, require: true })
  busId: Types.ObjectId;
}

export const SeatSchema = SchemaFactory.createForClass(seat);
