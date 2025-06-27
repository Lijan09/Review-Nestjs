import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserService } from 'src/user/user.service';
import { Schema } from 'mongoose';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepo: ReviewRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async getReviewsByPostId(postId: string) {
    return this.reviewRepo.getReviewsByPostId(postId);
  }

  async create(username: string, dto: CreateReviewDto) {
    const userId = await this.userService.getUserId(username);
    return this.reviewRepo.createReview(userId, dto);
  }

  findAll() {
    return this.reviewRepo.findAll();
  }

  async getReviewsByUserId(userId: Schema.Types.ObjectId) {
    return await this.reviewRepo.getReviewsByUserId(userId);
  }

  findOne(uuid: string) {
    return this.reviewRepo.findOne(uuid);
  }

  update(uuid: string, dto: UpdateReviewDto) {
    return this.reviewRepo.updateReview(uuid, dto);
  }

  delete(uuid: string) {
    return this.reviewRepo.deleteReview(uuid);
  }
}
