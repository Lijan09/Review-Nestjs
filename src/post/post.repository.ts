import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { Model, Schema } from 'mongoose';
import { QueryPostDto } from './dto/query-post.dto';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(createData: CreatePostDto) {
    const data = {
      title: createData.title,
      content: createData.content,
      authorId: createData.authorId,
    };
    const post = new this.postModel(data);
    await post.save();
    return post;
  }

  async getPostsByUserId(userId: Schema.Types.ObjectId) {
    const posts = await this.postModel.find({ authorId: userId }).exec();
    return posts;
  }

  async getAllPosts(queryData: QueryPostDto) {
    const { page, limit, query } = queryData;

    const skip = (page - 1) * limit;

    const filter = query
      ? {
          title: { $regex: query, $options: 'i' },
        }
      : {};

    console.log('Filter:', filter);

    const posts = await this.postModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .exec();
    // console.log('Posts:', posts);
    const total = await this.postModel.countDocuments(filter).exec();
    // console.log('Total:', total);
    return { posts, total };
  }

  async deletePost(deleteData: { uuid: string }) {
    const { uuid } = deleteData;
    const result = await this.postModel.findOne({ uuid: uuid }).exec();
    if (!result) {
      throw new BadRequestException(`Post not found`);
    }
    await result.deleteOne();
    return { message: `Post deleted successfully` };
  }

  async getPostById(postData: { uuid: string }) {
    const { uuid } = postData;
    const post = await this.postModel.findOne({ uuid }).exec();
    if (!post) {
      throw new BadRequestException(`Post not found`);
    }
    return post;
  }
}
