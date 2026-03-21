import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Review {
  _id: Types.ObjectId;

  @Prop({ default: uuidv4, unique: true })
  uuid: string;

  @Prop({ ref: 'Post', required: true })
  postId: string;

  @Prop({ ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ immutable: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  rating: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.path('rating').validate({
  validator: (value: number) => value >= 1 && value <= 5,
  message: 'Rating must be between 1 and 5.',
});
