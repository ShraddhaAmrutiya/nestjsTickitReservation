import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class stop {
  @Prop()
  stop: string;
}

export const stopSchema = SchemaFactory.createForClass(stop);
