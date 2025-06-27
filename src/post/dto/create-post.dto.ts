import { Schema } from 'mongoose';

export interface CreatePostDto {
  title: string;
  content: string;
  author: string;
  authorId: Schema.Types.ObjectId;
}
