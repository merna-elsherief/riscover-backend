import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Control } from './entities/control.entity';

@Injectable()
export class ControlsService {
  constructor(@InjectModel(Control.name) private controlModel: Model<Control>) {}

  async create(createControlDto: any) {
    return this.controlModel.create(createControlDto);
  }

  async findAll() {
    return this.controlModel.find().exec();
  }

  async findOne(id: string) {
    return this.controlModel.findById(id).exec();
  }
}