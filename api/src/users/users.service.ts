import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model, ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    return this.userModel.create({
      ...user,
      password: await hash(user.password, 10),
    });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findOne(id: ObjectId): Promise<User | null> {
    return this.userModel.findById(id);
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username });
  }
}
