import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { stop } from '../stop/stop.schema';
import { Types } from 'mongoose';

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

  @Prop({
    type: [{ type: Types.ObjectId, ref: stop.name }],
    validate: {
      validator: (arr: (string | Types.ObjectId)[]) =>
        Array.isArray(arr) && arr.every((id) => Types.ObjectId.isValid(id)),
      message: 'All stop values must be valid ObjectIds',
    },
  })
  stop: Types.ObjectId[];
}

export const RoutSchema = SchemaFactory.createForClass(Routs);
