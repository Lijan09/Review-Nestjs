import {
  Body,
  Controller,
  Post,
  Request,
  Response,
  // Get,
  // UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
// import { HttpExceptionFilter } from '../utils/exception.filter';

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

  @Post('reset-password/:token')
  async resetPassword(@Request() req, @Response() res) {
    const { token } = req.params;
    console.log('Reset token:', token);
    const isValid = this.authService.validateResetToken(token);
    console.log('Is reset token valid:', isValid);
    if (!isValid) {
      return res
        .status(400)
        .json({ message: 'Invalid or expired reset token' });
    }
    if (!req.body.newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }
    const { newPassword } = req.body;
    console.log('New password:', newPassword);
    const resetData = {
      username: '',
      resetToken: token,
      newPassword: newPassword,
    };
    const result = await this.authService.updatePassword(resetData);
    if (!result) {
      return res.status(500).json({ message: 'Failed to reset password' });
    }
    return res.status(200).json({ message: 'Password reset successfully' });
  }

  @Post('reset-password')
  async forgotPassword(@Body() body: { username: string }, @Response() res) {
    const resetToken = await this.authService.generateResetToken(body.username);
    return res.status(200).json({
      resetLink: `http://localhost:5000/auth/reset-password/${resetToken}`,
    });
  }
}
