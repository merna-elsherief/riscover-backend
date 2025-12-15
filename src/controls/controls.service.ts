import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Control } from './entities/control.entity';
import { CreateControlDto } from './dto/create-control.dto';

@Injectable()
export class ControlsService {
  constructor(@InjectModel(Control.name) private controlModel: Model<Control>) {}

  async create(createDto: CreateControlDto) {
    return this.controlModel.create(createDto);
  }

  async findAll() {
    return this.controlModel.find()
      .populate('linkedPolicies', 'title code') // هات اسم السياسة وكودها
      .exec();
  }

  async findOne(id: string) {
    const control = await this.controlModel.findById(id)
      .populate('linkedPolicies')
      .exec();
    if (!control) throw new NotFoundException('Control not found');
    return control;
  }

  // 🆕 دالة إضافة دليل (Evidence)
  async addEvidence(id: string, fileData: { fileName: string, fileUrl: string, uploadedBy: string }) {
    return this.controlModel.findByIdAndUpdate(
      id,
      { 
        $push: { evidence: { ...fileData, uploadDate: new Date() } }, // إضافة للأري
        status: 'In Progress' // ممكن نغير الحالة أوتوماتيك
      },
      { new: true }
    );
  }
}