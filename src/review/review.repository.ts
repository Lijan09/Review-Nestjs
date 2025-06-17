import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './entities/review.entity';
import { Model, Types, Schema } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewRepository {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async createReview(userId: Schema.Types.ObjectId, dto: CreateReviewDto) {
    const reviewCount = await this.reviewModel.countDocuments();
    const review = new this.reviewModel({
      ...dto,
      id: reviewCount + 1,
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

  async findOne(id: number) {
    const review = await this.reviewModel
      .findOne({ id })
      .populate('userId', 'username');
    if (!review) throw new NotFoundException(`Review with id ${id} not found`);
    return review;
  }

  async updateReview(id: number, dto: UpdateReviewDto) {
    const review = await this.reviewModel.findOneAndUpdate({ id }, dto, {
      new: true,
    });
    if (!review) throw new NotFoundException(`Review with id ${id} not found`);
    return review;
  }

  async deleteReview(id: number) {
    const review = await this.reviewModel.findOneAndDelete({ id });
    if (!review) throw new NotFoundException(`Review with id ${id} not found`);
    return review;
  }
}
