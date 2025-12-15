import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GovernanceDocument } from './entities/governance-document.entity';
import { CreateGovernanceDocumentDto } from './dto/create-governance-document.dto';
import { DocumentType } from './enums/document-type.enum';
import { DocumentStatus } from './enums/document-status.enum';

@Injectable()
export class GovernanceService {
  constructor(
    @InjectModel(GovernanceDocument.name) private docModel: Model<GovernanceDocument>,
  ) {}

  async create(createDto: CreateGovernanceDocumentDto) {
    return this.docModel.create(createDto);
  }

  // الفلترة بالنوع (Sidebar Filter)
  async findAll(type?: DocumentType) {
    const filter = type ? { type } : {}; // لو مفيش نوع، هات كله
    return this.docModel.find(filter)
      .populate('owner', 'firstName lastName email')
      .sort({ createdAt: -1 }) // الأحدث فوق
      .exec();
  }

  async findOne(id: string) {
    return this.docModel.findById(id).populate('owner').exec();
  }

  // تحديث (عشان نغير الحالة أو نرفع فيرجن جديد)
  async update(id: string, updateDto: any) {
    return this.docModel.findByIdAndUpdate(id, updateDto, { new: true });
  }

  async remove(id: string) {
    return this.docModel.findByIdAndDelete(id);
  }

  async getGovernanceStats() {
    const total = await this.docModel.countDocuments();
    const submitted = await this.docModel.countDocuments({ status: DocumentStatus.SUBMITTED });
    const reopen = await this.docModel.countDocuments({ status: DocumentStatus.REOPEN });
    const closed = await this.docModel.countDocuments({ status: DocumentStatus.CLOSED });

    return {
      total,
      submitted,
      reopen,
      closed
    };
  }

  async addActivity(id: string, action: string, user: string, details: string) {
    return this.docModel.findByIdAndUpdate(id, {
      $push: { 
        activityTimeline: { action, user, details, date: new Date() } 
      }
    }, { new: true });
  }
}