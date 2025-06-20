import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class bus {
  @Prop()
  busName: string;

  @Prop()
  busNumber: number;

  @Prop()
  totalSeat: number;

  @Prop()
  availableSeat: number;

  @Prop()
  busType: string;
}

export const busSchema = SchemaFactory.createForClass(bus);
