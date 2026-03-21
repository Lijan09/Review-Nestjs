import { QueryPostDto } from './dto/query-post.dto';
import {
  Controller,
  Get,
  Response,
  Post,
  Body,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getPosts(@Response() res, @Query() query: QueryPostDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    if (page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ message: 'Page and limit must be positive integers.' });
    }
    if (query.query && typeof query.query !== 'string') {
      return res
        .status(400)
        .json({ message: 'Query must be a string if provided.' });
    }
    const queryData: QueryPostDto = {
      page: page,
      limit: limit,
      query: query.query,
    };
    // console.log('Query Data:', queryData);
    const result = await this.postService.getallPosts(queryData);
    // console.log('Result:', result);
    return res.status(200).json(result);
  }

  @Get(':uuid')
  async getPostById(@Response() res, @Param('uuid') uuid: string) {
    const result = await this.postService.getPostById({ uuid });
    return res.status(200).json(result);
  }

  @Get('/:uuid/review')
  async getReviewsByPostId(@Response() res, @Param('uuid') uuid: string) {
    const reviews = await this.postService.getReviewsByPostId(uuid);

    return res.status(200).json(reviews);
  }

  @Post()
  async createPost(@Response() res, @Body() createData: CreatePostDto) {
    const result = await this.postService.createPost(createData);
    return res.status(201).json(result);
  }

  @Delete(':uuid')
  async deletePost(@Response() res, @Param('uuid') uuid: string) {
    const result = await this.postService.deletePost({ uuid });
    return res.status(501).json({ message: result });
  }
}
