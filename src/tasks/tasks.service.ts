import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    // بنحول الـ riskId اللي جي من الـ DTO للحقل risk اللي في الـ Entity
    const newTask = new this.taskModel({
      ...createTaskDto,
      risk: createTaskDto.riskId, 
      relatedControl: createTaskDto.relatedControlId,
    });
    return await newTask.save();
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().populate('risk').exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).populate('risk').exec();
    if (!task) throw new NotFoundException(`Task #${id} not found`);
    return task;
  }

  // دي عشان نجيب كل المهام الخاصة بريسك معين
  async findByRisk(riskId: string): Promise<Task[]> {
    return this.taskModel.find({ risk: riskId }).exec();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
    if (!updatedTask) throw new NotFoundException(`Task #${id} not found`);
    return updatedTask;
  }

  async remove(id: string): Promise<Task> {
    const deletedTask = await this.taskModel.findByIdAndDelete(id).exec();
    if (!deletedTask) throw new NotFoundException(`Task #${id} not found`);
    return deletedTask;
  }
}