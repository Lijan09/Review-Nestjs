import {
  Body,
  Controller,
  Post,
  Request,
  Response,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { HttpExceptionFilter } from '../utils/exception.filter';

@Controller('auth')
// @UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Response() res) {
    const result = await this.authService.register(createUserDto);
    return res.status(201).json(result);
  }

  @UseGuards(LocalAuthGuard) //validates user credentials
  @Post('login')
  login(@Request() req, @Response() res) {
    const result = this.authService.login(req.user); //returns token if valid
    return res.status(200).json(result);
  }

  @UseGuards(JwtAuthGuard) //validates token
  @Post('logout')
  logout(@Response() res) {
    res.clearCookie('jwt');
    return res.status(200).json({ message: 'Logged out successfully' });
  }
}
