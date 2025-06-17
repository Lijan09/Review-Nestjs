import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import passwordUtils from 'src/utils/password.utils';
import { ResetTokenDto } from './dto/reset-token.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createData: CreateUserDto) {
    if (!createData.username || !createData.password) {
      throw new BadRequestException(
        'Username and password are required to create a user.',
      );
    }
    return await this.userRepository.createUser(createData);
  }

  async findAll() {
    const users = await this.userRepository.findAllUsers();
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    });
  }

  async findOne(username: string) {
    console.log('Finding user with data:', username);
    const user = await this.userRepository.findUser(username);
    return user;
  }

  async update(updateData: UpdateUserDto) {
    if (!updateData.newPassword || !updateData.oldPassword) {
      throw new BadRequestException(
        'Both old and new passwords are required to update a user.',
      );
    }
    const existing = await this.findOne(updateData.username as string);
    if (!existing) {
      throw new BadRequestException(
        `User with username ${updateData.username} does not exist.`,
      );
    }
    const isValid = await passwordUtils.validatePassword(
      updateData.oldPassword,
      existing.password,
    );
    console.log(isValid);
    if (!isValid) {
      throw new BadRequestException('Invalid old password provided.');
    }
    const user = await this.userRepository.updateUser(updateData);
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async delete(userData: CreateUserDto) {
    const user = await this.userRepository.deleteUser(userData);
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async setToken(resetData: ResetTokenDto) {
    await this.userRepository.setToken(resetData);
  }

  async updatePassword(resetData: ResetTokenDto) {
    const user = await this.userRepository.updatePassword(resetData);
    return user;
  }

  async getUserId(username: string) {
    const user = await this.userRepository.findUser(username);
    if (!user) {
      throw new BadRequestException(
        `User with username ${username} not found.`,
      );
    }
    const id = user._id;
    return id;
  }
}
