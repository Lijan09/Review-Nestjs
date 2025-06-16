import {
  Controller,
  Get,
  Body,
  Delete,
  Request,
  UseGuards,
  Response,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  //needs guard for admin access
  async findAll() {
    return await this.userService.findAll();
  }

  @Get()
  async findOne(@Request() req, @Response() res) {
    const result = await this.userService.findOne(req.user.username);
    const { password, ...userWithoutPassword } = result.toObject();
    return res.status(200).json(userWithoutPassword);
  }

  @Put()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
    @Response() res,
  ) {
    console.log('updateUserDto: ', updateUserDto);
    const result = await this.userService.update(
      updateUserDto,
      req.user.username,
    );
    return res.status(200).json(result);
  }

  @Delete()
  async delete(@Request() req, @Response() res) {
    const result = await this.userService.delete(req.user.username);
    return res.status(200).json(result);
  }
}
