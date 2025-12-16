import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task, TaskSchema } from './entities/task.entity';

@Module({
  imports: [
    // تسجيل الـ Schema في قاعدة البيانات
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService], // بنعمل export عشان لو حبينا نستخدمه في مكان تاني
})
export class TasksModule {}