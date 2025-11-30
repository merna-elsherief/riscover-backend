import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// DTOs
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskStatusDto } from './dto/update-risk-status.dto';
import { FilterRiskDto } from './dto/filter-risk.dto';

// Entities & Enums
import { Risk } from './entities/risk.entity';
import { CommonService } from '../common/common.service';
import { UserRole } from '../users/entities/user.entity';
import { RiskStatus } from '../risks/enums/risk-status.enum'; // تأكدي إنك عملتي الملف ده

@Injectable()
export class RisksService {
  constructor(
    @InjectModel(Risk.name) private riskModel: Model<Risk>,
    private commonService: CommonService,
  ) {}

  // ======================================================
  // 1. Core Logic (Create & Get Next ID)
  // ======================================================

  async create(createRiskDto: CreateRiskDto, user: any): Promise<Risk> {
    // أ) نجيب الرقم اللي عليه الدور من العداد
    const seqNum = await this.commonService.getNextSequence('risks');
    
    // ب) نحسب السنة الحالية
    const currentYear = new Date().getFullYear();

    // ج) نكون الـ ID بالشكل الجديد (R-2025-001)
    const formattedId = `R-${currentYear}-${seqNum.toString().padStart(3, '0')}`;

    // د) تجهيز الخطر للحفظ
    const newRisk = new this.riskModel({
      ...createRiskDto,           // نسخ كل البيانات من الفورم (Title, Emails, etc...)
      siNo: formattedId,          // الرقم المكون
      createdBy: user.userId,     // مين اليوزر اللي فاتح السيستم وسجل الخطر
      
      // أول سطر في التايم لاين
      timeline: [{
        user: user.userId,
        action: 'Created',
        details: `Risk registered by ${user.email}`,
        timestamp: new Date()
      }]
    });

    // (الـ Score بيتحسب لوحده في الـ Pre-save hook اللي في الـ Entity)
    return newRisk.save();
  }

  // دالة المعاينة (عشان الفرونت يعرض الرقم قبل الحفظ)
  async getNextId(): Promise<{ nextId: string }> {
    const seqNum = await this.commonService.peekNextSequence('risks');
    const currentYear = new Date().getFullYear();
    const formattedId = `R-${currentYear}-${seqNum.toString().padStart(3, '0')}`;
    return { nextId: formattedId };
  }

  // ======================================================
  // 2. Search & Filtering (Dashboard List)
  // ======================================================

  async findAll(filters: FilterRiskDto): Promise<Risk[]> {
    const query: any = {};

    // فلتر البحث بالنص (في العنوان أو الوصف أو النظام المتأثر)
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { affectedSystem: { $regex: filters.search, $options: 'i' } }
      ];
    }

    // فلتر بالحالة (Dropdown)
    if (filters.status) {
      query.status = filters.status;
    }

    // التنفيذ
    return this.riskModel.find(query)
      .populate('createdBy', 'firstName lastName department') // هات بيانات اللي سجل الخطر
      .sort({ createdAt: -1 }) // الأحدث أولاً
      .exec();
  }

  async findOne(id: string): Promise<Risk> {
    const risk = await this.riskModel.findById(id)
      .populate('createdBy', 'firstName lastName email department')
      .populate('timeline.user', 'firstName lastName') // عشان يظهر مين كتب الكومنت
      .exec();

    if (!risk) {
      throw new NotFoundException(`Risk #${id} not found`);
    }
    return risk;
  }

  // ======================================================
  // 3. Workflow & Actions (Status, Comments)
  // ======================================================

  async updateStatus(id: string, updateDto: UpdateRiskStatusDto, user: any): Promise<Risk> {
    const risk = await this.riskModel.findById(id);
    if (!risk) throw new NotFoundException('Risk not found');

    // التحقق من صلاحية الـ BU Head للموافقة
    if (updateDto.status === RiskStatus.ACCEPTED) { // على حسب الـ Enum بتاعك
       
      // 1. هل اليوزر BU Head أو Admin؟
      const isAuthorizedRole = user.role === UserRole.BU_HEAD || user.role === UserRole.ADMIN;
      if (!isAuthorizedRole) {
        throw new ForbiddenException('Only BU Heads can accept risks');
      }

      // 2. هل هو نفس القسم؟ (اختياري حسب البيزنس)
      // لو الـ User اللي عمل Create كان ليه Department، نقارن بيه
      // risk.createdBy بيكون ID، فممكن نحتاج نعمل populate الأول أو نقارن لو مخزنين القسم كنص
      // للتبسيط حالياً هنكتفي بالتحقق من الـ Role
    }

    const oldStatus = risk.status;
    risk.status = updateDto.status;
    
    // إضافة تبرير القبول لو موجود
    if (updateDto.justification) {
      risk.remediationPlanSummary = `Acceptance Justification: ${updateDto.justification}`; 
      // أو ممكن تعملي حقل جديد اسمه acceptanceJustification
    }

    // تسجيل الحدث في التايم لاين
    risk.timeline.push({
      user: user.userId,
      action: 'Status Change',
      details: `Status changed from ${oldStatus} to ${updateDto.status}`,
      timestamp: new Date()
    } as any);

    return risk.save();
  }

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

  // ======================================================
  // 4. Dashboard Widgets (Stats)
  // ======================================================

  async getDashboardStats() {
    const stats = await this.riskModel.aggregate([
      {
        $group: {
          _id: null,
          totalRisks: { $sum: 1 },
          avgScore: { $avg: '$score' },
          // عد حسب الحالة
          draftCount: { $sum: { $cond: [{ $eq: ['$status', 'Draft'] }, 1, 0] } },
          openCount: { $sum: { $cond: [{ $ne: ['$status', 'Closed'] }, 1, 0] } },
          // عد حسب الأولوية
          criticalCount: { $sum: { $cond: [{ $eq: ['$priority', 'Critical'] }, 1, 0] } },
          highCount: { $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] } }
        }
      }
    ]);

    return stats[0] || { totalRisks: 0, criticalCount: 0 };
  }
}