import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

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

  async update(updateData: UpdateUserDto, username: string) {
    updateData.username = username;
    const user = await this.userRepository.updateUser(updateData);
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async delete(userData: CreateUserDto) {
    const user = await this.userRepository.deleteUser(userData);
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }
}
