import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import passwordUtils from '../../utils/password.utils';

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

@Schema()
export class User {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.path('password').validate({
  validator: (value: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value),
  message:
    'Password must be at least 8 characters long and contain one uppercase, one lowercase letter, and one digit.',
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await passwordUtils.hashPassword(this.password);
  }
  next();
});
