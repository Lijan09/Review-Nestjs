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
    const user = await this.userModel.findOne({
      username: updateData.username,
    });
    if (!user) {
      throw new NotFoundException(
        `User with username ${updateData.username} not found`,
      );
    }
    if (updateData.password) {
      user.password = updateData.password;
    }
    await user.save();

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
}
