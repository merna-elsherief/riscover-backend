import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Risk } from './entities/risk.entity';
import { CreateRiskDto } from './dto/create-risk.dto';
import { CommonService } from '../common/common.service'; 
import { RiskLevel } from './enums/risk-enums'; // تأكدي من مسار الـ Enum

@Injectable()
export class RisksService {
  constructor(
    @InjectModel(Risk.name) private riskModel: Model<Risk>,
    private commonService: CommonService, // 💉 حقن خدمة العدادات
  ) {}

  // ==========================================
  // 1. Helper Methods (حسابات)
  // ==========================================
  
  // دالة بتحول الرقم (النتيجة) لمستوى (High/Low)
  private calculateLevel(score: number): RiskLevel {
    if (score >= 20) return RiskLevel.CRITICAL; // 20-25
    if (score >= 12) return RiskLevel.HIGH;     // 12-19
    if (score >= 5)  return RiskLevel.MEDIUM;   // 5-11
    return RiskLevel.LOW;                       // 1-4
  }

  // ==========================================
  // 2. CRUD Operations
  // ==========================================

  async create(createDto: CreateRiskDto) {
    // أ) توليد الـ ID (مثال: R-2025-001)
    const seq = await this.commonService.getNextSequence('risks');
    const riskId = `R-${new Date().getFullYear()}-${seq.toString().padStart(3, '0')}`;

    // ب) حساب Inherent Score (قبل العلاج)
    const inherentScore = createDto.inherentLikelihood * createDto.inherentImpact;
    const inherentLevel = this.calculateLevel(inherentScore);

    // ج) حساب Residual Score (بعد العلاج) - لو البيانات موجودة
    let residualData = {};
    if (createDto.residualLikelihood && createDto.residualImpact) {
      const rScore = createDto.residualLikelihood * createDto.residualImpact;
      residualData = {
        residualScore: rScore,
        residualLevel: this.calculateLevel(rScore)
      };
    }

    // د) تجميع البيانات والحفظ
    const newRisk = new this.riskModel({
      ...createDto,
      riskId,
      inherentScore,
      inherentLevel,
      ...residualData
    });

    return newRisk.save();
  }

  async findAll() {
    return this.riskModel.find()
      .populate('affectedAssets', 'name assetId')     // هات اسم وكود الأصل
      .populate('mitigatingControls', 'code name status') // هات الضوابط
      .populate('owner', 'firstName lastName jobTitle')   // هات المالك
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const risk = await this.riskModel.findById(id)
      .populate('affectedAssets')
      .populate('mitigatingControls')
      .populate('owner')
      .exec();
    
    if (!risk) {
      throw new NotFoundException(`Risk #${id} not found`);
    }
    return risk;
  }

  // 👇 الدوال اللي كانت ناقصة وعملت Error

  async update(id: string, updateDto: any) {
    // ملحوظة: لو حابة تعيدي حساب الـ Score عند التحديث، ممكن تضيفي اللوجيك هنا
    // حالياً بنحدث البيانات زي ما هي
    const updatedRisk = await this.riskModel
      .findByIdAndUpdate(id, updateDto, { new: true }) // new: true بترجع الداتا الجديدة
      .exec();

    if (!updatedRisk) {
      throw new NotFoundException(`Risk #${id} not found`);
    }
    return updatedRisk;
  }

  async remove(id: string) {
    const deletedRisk = await this.riskModel.findByIdAndDelete(id).exec();
    if (!deletedRisk) {
      throw new NotFoundException(`Risk #${id} not found`);
    }
    return deletedRisk;
  }
}