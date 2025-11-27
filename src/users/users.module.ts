import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // <-- استيراد
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entities/user.entity'; // <-- استيراد

@Module({
  imports: [
    // السطر ده هو اللي بيربط الموديل
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService] // هنحتاجه بعدين في الـ Auth
})
export class UsersModule {}