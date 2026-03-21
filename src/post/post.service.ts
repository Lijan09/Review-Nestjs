import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { ReviewService } from 'src/review/review.service';
import { Schema } from 'mongoose';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    @Inject(forwardRef(() => ReviewService))
    private readonly reviewService: ReviewService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async getallPosts(queryData: QueryPostDto) {
    return await this.postRepository.getAllPosts(queryData);
  }

  async getPostsByUserId(userId: Schema.Types.ObjectId) {
    return await this.postRepository.getPostsByUserId(userId);
  }

  async getReviewsByPostId(uuid: string) {
    return await this.reviewService.getReviewsByPostId(uuid);
  }

  async createPost(createData: CreatePostDto) {
    const authorId = await this.userService.getUserId(createData.author);
    createData.authorId = authorId;
    return await this.postRepository.createPost(createData);
  }

  async deletePost(deleteData: { uuid: string }) {
    return await this.postRepository.deletePost(deleteData);
  }

  async getPostById(postData: { uuid: string }) {
    return await this.postRepository.getPostById(postData);
  }
}
