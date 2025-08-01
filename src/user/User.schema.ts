import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  // toJSON: {
  //   transform(doc, ret: any) {
  //     delete ret.password;
  //     return ret;
  //   },
  // },
})
export class User {
  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  Role: string;

  @Prop()
  age: number;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
