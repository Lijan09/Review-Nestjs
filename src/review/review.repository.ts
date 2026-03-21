import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './entities/review.entity';
import { Model, Schema } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewRepository {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async getReviewsByPostId(postId: string) {
    const reviews = await this.reviewModel
      .find({ postId: postId })
      .populate('userId', 'username');
    console.log('Reviews:', reviews);
    if (!reviews || reviews.length === 0) {
      throw new NotFoundException(
        `No reviews found for post with id ${postId}`,
      );
    }
    return reviews;
  }

  async createReview(userId: Schema.Types.ObjectId, dto: CreateReviewDto) {
    const review = new this.reviewModel({
      ...dto,
      userId,
    });
    return await review.save();
  }

  async findAll() {
    return await this.reviewModel
      .find()
      .populate('userId', 'username')
      .populate('postId');
  }

  async getReviewsByUserId(userId: Schema.Types.ObjectId) {
    const reviews = await this.reviewModel.find({ userId: userId }).exec();
    console.log('Reviews for user:', reviews);
    if (!reviews || reviews.length === 0) {
      throw new NotFoundException(`No reviews found for user`);
    }
    return reviews;
  }

  async findOne(uuid: string) {
    const review = await this.reviewModel
      .findOne({ uuid })
      .populate('userId', 'username');
    if (!review)
      throw new NotFoundException(`Review with uuid ${uuid} not found`);
    return review;
  }

  async updateReview(uuid: string, dto: UpdateReviewDto) {
    const review = await this.reviewModel.findOneAndUpdate({ uuid }, dto, {
      new: true,
    });
    if (!review)
      throw new NotFoundException(`Review with uuid ${uuid} not found`);
    return review;
  }

  async deleteReview(uuid: string) {
    const review = await this.reviewModel.findOneAndDelete({ uuid });
    if (!review)
      throw new NotFoundException(`Review with uuid ${uuid} not found`);
    return review;
  }
}
