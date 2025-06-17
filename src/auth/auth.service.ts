import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import passwordUtils from '../utils/password.utils';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { ResetTokenDto } from 'src/user/dto/reset-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const newUser = await this.userService.createUser(createUserDto);
    const { password, ...userWithoutPassword } = newUser.toObject();

    const token = this.jwtService.sign({
      username: newUser.username,
    });

    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
      access_token: token,
    };
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne(username);
    if (
      user &&
      (await passwordUtils.validatePassword(password, user.password))
    ) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  login(user: any) {
    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateResetToken(username: string) {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new Error('User not found');
    }
    const resetToken = passwordUtils.generateResetToken();
    const hashedResetToken = passwordUtils.hashResetToken(resetToken);
    const resetData = {
      username: user.username,
      resetToken: hashedResetToken,
      newPassword: '',
    };
    await this.userService.setToken(resetData);
    return resetToken;
  }

  validateResetToken(token: string) {
    const hashedToken = passwordUtils.hashResetToken(token);
    const isValid = passwordUtils.validateResetToken(token, hashedToken);
    return isValid;
  }

  async updatePassword(resetData: ResetTokenDto) {
    resetData.resetToken = passwordUtils.hashResetToken(resetData.resetToken);
    const user = await this.userService.updatePassword(resetData);
    return user;
  }
}
