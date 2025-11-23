import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRiskDto } from './dto/create-risk.dto';
import { Risk } from './entities/risk.entity';
import { CommonService } from '../common/common.service';
import { UpdateRiskStatusDto } from './dto/update-risk-status.dto';
import { UserRole } from '../users/entities/user.entity';
import { RiskStatus } from './enums/risk-status.enum';

@Injectable()
export class RisksService {
  constructor(
    @InjectModel(Risk.name) private riskModel: Model<Risk>,
    private commonService: CommonService, // حقن خدمة العد
  ) {}

  // لاحظي هنا: الدالة بتاخد الـ DTO وكمان بيانات اليوزر من التوكن
  async create(createRiskDto: CreateRiskDto, user: any): Promise<Risk> {
    
    // 1. نجيب الرقم الجديد من العداد
    const seqNum = await this.commonService.getNextSequence('risks');
    
    // 2. نظبط شكل الـ ID (مثلاً RISK-001)
    // padStart(3, '0') بتخلي الرقم 1 يبقى 001
    const formattedId = `RISK-${seqNum.toString().padStart(3, '0')}`;

    // 3. نجهز الأوبجكت للحفظ
    const newRisk = new this.riskModel({
      ...createRiskDto,           // (Title, Description, Likelihood, Impact)
      siNo: formattedId,          // الرقم الآلي
      owner: user.userId,         // ID اليوزر من التوكن
      department: user.department // قسم اليوزر من التوكن
    });

    // 4. الحفظ (الـ Score هيتحسب لوحده في الـ Hook اللي في الـ Schema)
    return newRisk.save();
  }

  async findAll() {
  return this.riskModel.find()
    .populate('owner', 'firstName lastName email department') // هات الحقول دي بس من جدول اليوزر
    .exec();
  }

  async findOne(id: string) {
  return this.riskModel.findById(id)
    .populate('owner', 'firstName lastName email department')
    .exec();
  }
  // 4. تحديث حالة الخطر (المنطقة المحظورة ⛔)
  async updateStatus(id: string, updateDto: UpdateRiskStatusDto, user: any): Promise<Risk> {
    // أ) لازم نتأكد إن الخطر موجود الأول
    const risk = await this.riskModel.findById(id);
    if (!risk) {
      throw new NotFoundException('Risk not found');
    }

    // ب) تطبيق القواعد (Business Rules)
    
    // القاعدة: لو الحالة "مقبول" (Accepted)
    if (updateDto.status === RiskStatus.ACCEPTED) {
      
      // 1. لازم يكون الشخص BU Head أو Admin
      const isAuthorizedRole = user.role === UserRole.BU_HEAD || user.role === UserRole.ADMIN;
      if (!isAuthorizedRole) {
        throw new ForbiddenException('Only BU Heads or Admins can accept risks!');
      }

      // 2. لو هو BU Head، لازم يكون نفس القسم بتاع الخطر
      if (user.role === UserRole.BU_HEAD && user.department !== risk.department) {
        throw new ForbiddenException('You are not authorized to approve risks for this department!');
      }

      // هنا ممكن نضيف لوجيك زيادة: نحفظ تاريخ الموافقة ومين اللي وافق في حقول خاصة
      // risk.acceptedBy = user.userId;
      // risk.acceptedAt = new Date();
    }

    // ج) التحديث والحفظ
    risk.status = updateDto.status;
    
    // لو فيه تبرير جاي في الـ Body، ممكن نحفظه (لو ضفناه في الـ Entity)
    // if (updateDto.justification) {
    //   risk.justification = updateDto.justification;
    // }

    return risk.save();
  }
}