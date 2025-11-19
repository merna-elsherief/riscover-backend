import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 1. التحقق من التكرار (Username OR Email)
    const existingUser = await this.userModel.findOne({
      $or: [
        { email: createUserDto.email },
        { username: createUserDto.username }
      ]
    });

    if (existingUser) {
      throw new BadRequestException('Email or Username already exists');
    }

    // 2. تشفير الباسورد
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // 3. الحفظ (مع إضافة provider default)
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      provider: 'local', // بنثبتها هنا
    });

    return newUser.save();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    return this.userModel.findById(id).exec();
  }
  
  // دالة مساعدة للبحث بالاسم (هنحتاجها في الـ Login)
  async findByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  // دالة مساعدة للـ Login
async findByEmail(email: string): Promise<User | null> {
  return this.userModel.findOne({ email }).exec();
}
}