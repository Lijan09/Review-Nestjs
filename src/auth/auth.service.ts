import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import passwordUtils from '../utils/password.utils';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

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
}
