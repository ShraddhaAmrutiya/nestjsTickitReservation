import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BusDocument = bus & Document;

@Schema()
export class bus {
  @Prop({ required: true, unique: true })
  busNumber: number;

  @Prop({ required: true })
  busName: string;

  @Prop({ required: true })
  busType: string;
  @Prop()
  totalSeats: number;
  @Prop()
  availabeSeats: number;
  @Prop({
    type: [
      {
        seatNumber: { type: String, required: true },
        available: { type: Boolean, default: true },
      },
    ],
    default: [],
  })
  seats: {
    number: string;
    seatNumber: any;
    available: boolean;
  }[];
}

export const BusSchema = SchemaFactory.createForClass(bus);
