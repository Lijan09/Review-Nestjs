import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetTokenDto } from './dto/reset-token.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createData: CreateUserDto) {
    const data = {
      username: createData.username,
      password: createData.password,
      role: createData.role || 'user',
    };
    const existingUser = await this.userModel.findOne({
      username: data.username,
    });
    if (existingUser) {
      throw new BadRequestException(
        `User with username ${data.username} already exists`,
      );
    }
    const user = new this.userModel(data);
    await user.save();
    return user;
  }

  async findAllUsers() {
    const users = await this.userModel.find();
    return users;
  }

  async findUser(username: string) {
    const user = await this.userModel.findOne({ username: username });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async updateUser(updateData: UpdateUserDto) {
    console.log('Updating user with data:', updateData);
    const user = await this.userModel.findOne({
      username: updateData.username,
    });
    if (!user) {
      throw new NotFoundException(
        `User with username ${updateData.username} not found`,
      );
    }
    if (updateData.newPassword) {
      user.password = updateData.newPassword;
    }
    await user.save();
    console.log('User updated:', user);

    return user;
  }

  async deleteUser(userdata: CreateUserDto) {
    const user = await this.userModel.findOne({ username: userdata.username });
    if (!user) {
      throw new NotFoundException(
        `User with username ${userdata.username} not found`,
      );
    }
    await user.deleteOne();
    return user;
  }

  async setToken(resetData: ResetTokenDto) {
    const user = await this.userModel.findOne({ username: resetData.username });
    if (!user) {
      throw new NotFoundException(
        `User with username ${resetData.username} not found`,
      );
    }
    user.resetToken = resetData.resetToken;
    await user.save();
  }

  async updatePassword(resetData: ResetTokenDto) {
    const user = await this.userModel.findOne({
      resetToken: resetData.resetToken,
    });
    if (!user) {
      throw new NotFoundException(
        `User with reset token ${resetData.resetToken} not found`,
      );
    }
    user.password = resetData.newPassword;
    user.resetToken = null;
    await user.save();
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }
}
