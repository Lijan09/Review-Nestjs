import { Injectable } from '@nestjs/common';
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
    const user = new this.userModel(data);
    await user.save();
    return user;
  }
  async findAllUsers() {
    const user = await this.userModel.find();
    return user;
  }
  async findUser(username: string) {
    const user = await this.userModel.findOne({ username });
    return user;
  }
  updateUser(updateData: UpdateUserDto) {
    return `User with ID`;
  }
  deleteUser(id: string): string {
    return `User with ID: ${id} deleted`;
  }
}
