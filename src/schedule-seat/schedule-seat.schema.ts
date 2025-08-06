// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// @Schema()
// export class ScheduleSeat extends Document {
//   @Prop({ required: true })
//   scheduleId: string;

//   @Prop({ required: true })
//   seatNumber: string;

//   @Prop({ default: true })
//   available: boolean;

//   @Prop({ type: String, default: null })
//   userId: string | null;
// }

// export const ScheduleSeatSchema = SchemaFactory.createForClass(ScheduleSeat);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Seat {
  @Prop()
  seatNumber: string;

  @Prop({ default: true })
  available: boolean;

  @Prop({ type: String, default: null })
  userId: string | null;
}

@Schema()
export class ScheduleSeat extends Document {
  @Prop({ required: true })
  scheduleId: string;

  @Prop({ type: [Seat], default: [] })
  seats: Seat[];

  @Prop()
  totalSeats: number;

  @Prop()
  availableSeats: number;
}

export const ScheduleSeatSchema = SchemaFactory.createForClass(ScheduleSeat);
