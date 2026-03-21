import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ default: uuidv4, unique: true })
  uuid: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop({ ref: 'User' })
  authorId: Types.ObjectId;

  @Prop({ default: Date.now, immutable: true })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
