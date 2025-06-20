import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  //for remove password from response body
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  @Prop()
  userName: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  Role: string;
  @Prop()
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
