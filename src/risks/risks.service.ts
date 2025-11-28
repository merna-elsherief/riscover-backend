import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskStatusDto } from './dto/update-risk-status.dto';
import { Risk } from './entities/risk.entity';
import { CommonService } from '../common/common.service';
import { UserRole } from '../users/entities/user.entity';
import { RiskStatus } from './enums/risk-status.enum';

@Injectable()
export class RisksService {
  constructor(
    @InjectModel(Risk.name) private riskModel: Model<Risk>,
    private commonService: CommonService,
  ) {}

  // 1. إنشاء خطر جديد (مع التايم لاين)
  async create(createRiskDto: CreateRiskDto, user: any): Promise<Risk> {
    const seqNum = await this.commonService.getNextSequence('risks');
    const formattedId = `RISK-${seqNum.toString().padStart(3, '0')}`;

    const newRisk = new this.riskModel({
      ...createRiskDto,
      siNo: formattedId,
      owner: user.userId,
      department: user.department,
      // 🆕 أول حدث في التايم لاين: تم الإنشاء
      timeline: [{
        user: user.userId,
        action: 'Created',
        details: 'Risk created via API',
        timestamp: new Date()
      }]
    });

    return newRisk.save();
  }

  // 2. تحديث الحالة (مع التايم لاين)
  async updateStatus(id: string, updateDto: UpdateRiskStatusDto, user: any): Promise<Risk> {
    const risk = await this.riskModel.findById(id);
    if (!risk) throw new NotFoundException('Risk not found');

    // التحقق من الصلاحيات (BU Head)
    if (updateDto.status === RiskStatus.ACCEPTED) {
      const isAuthorized = user.role === UserRole.BU_HEAD || user.role === UserRole.ADMIN;
      if (!isAuthorized) throw new ForbiddenException('Only BU Heads can accept risks');
      
      if (user.role === UserRole.BU_HEAD && user.department !== risk.department) {
        throw new ForbiddenException('Department mismatch');
      }
    }

    const oldStatus = risk.status;
    risk.status = updateDto.status;
    
    if (updateDto.justification) {
      risk.acceptanceJustification = updateDto.justification;
    }

    // 🆕 تسجيل تغيير الحالة في التايم لاين
    risk.timeline.push({
      user: user.userId,
      action: 'Status Change',
      details: `Changed status from ${oldStatus} to ${updateDto.status}`,
      timestamp: new Date()
    } as any);

    return risk.save();
  }

  // 3. إضافة تعليق (Timeline Only)
  async addComment(id: string, comment: string, user: any): Promise<Risk> {
    const risk = await this.riskModel.findById(id);
    if (!risk) throw new NotFoundException('Risk not found');

    risk.timeline.push({
      user: user.userId,
      action: 'Comment',
      details: comment,
      timestamp: new Date()
    } as any);

    return risk.save();
  }

  // الدوال العادية
  async findAll() {
    return this.riskModel.find()
      .populate('owner', 'firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    return this.riskModel.findById(id)
      .populate('owner', 'firstName lastName email')
      .populate('controls') // عشان يظهر تفاصيل الضوابط لو موجودة
      .populate('timeline.user', 'firstName lastName') // عشان يظهر اسم اللي عمل الكومنت
      .exec();
  }

  async getNextId(): Promise<{ nextId: string }> {
  // 1. شوف الرقم اللي عليه الدور
  const seqNum = await this.commonService.peekNextSequence('risks');
  
  // 2. ظبط الشكل (RISK-005)
  const formattedId = `RISK-${seqNum.toString().padStart(3, '0')}`;
  
  // 3. رجعه كـ Object
  return { nextId: formattedId };
 }
  
}