import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('review')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateReviewDto) {
    console.log(dto);
    return this.reviewService.create(req.user.username, dto);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.reviewService.findOne(uuid);
  }

  @Put(':uuid')
  update(@Param('uuid') uuid: string, @Body() dto: UpdateReviewDto) {
    return this.reviewService.update(uuid, dto);
  }

  @Delete(':uuid')
  delete(@Param('uuid') uuid: string) {
    return this.reviewService.delete(uuid);
  }
}
