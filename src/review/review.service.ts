import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Types } from 'mongoose';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepo: ReviewRepository,
    private readonly userService: UserService,
  ) {}

  async create(username: string, dto: CreateReviewDto) {
    const userId = await this.userService.getUserId(username);
    return this.reviewRepo.createReview(userId, dto);
  }

  findAll() {
    return this.reviewRepo.findAll();
  }

  findOne(id: number) {
    return this.reviewRepo.findOne(id);
  }

  update(id: number, dto: UpdateReviewDto) {
    return this.reviewRepo.updateReview(id, dto);
  }

  delete(id: number) {
    return this.reviewRepo.deleteReview(id);
  }
}
