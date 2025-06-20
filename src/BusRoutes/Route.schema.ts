import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class Routs {
  @Prop()
  from: string;
  @Prop()
  to: string;
  @Prop()
  distance: number;
  @Prop()
  timeDuration: string;
}
export const RoutSchema = SchemaFactory.createForClass(Routs);
