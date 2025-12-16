import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Risk, RiskDocument, RiskTimeline, RiskStatus } from './entities/risk.entity';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';

@Injectable()
export class RisksService {
  constructor(@InjectModel(Risk.name) private riskModel: Model<RiskDocument>) {}

  // 1️⃣ دالة توليد الـ ID (R-2025-001)
  async generateNextRiskId(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `R-${currentYear}`;
    const lastRisk = await this.riskModel
      .findOne({ riskCustomId: { $regex: `^${prefix}` } })
      .sort({ createdAt: -1 })
      .exec();

    let sequence = 1;
    if (lastRisk) {
      const lastSequenceStr = lastRisk.riskCustomId.split('-').pop();
      if (lastSequenceStr) sequence = parseInt(lastSequenceStr, 10) + 1;
    }
    return `${prefix}-${sequence.toString().padStart(3, '0')}`;
  }

  // 2️⃣ دالة حساب مستوى الخطر (شغالة للـ Inherent و الـ Residual)
  private calculateRiskLevel(rating: number): string {
    if (rating >= 16) return 'Critical';
    if (rating >= 12) return 'High';
    if (rating >= 6) return 'Medium';
    return 'Low';
  }

  // 3️⃣ Create: إنشاء خطر جديد
  async create(createRiskDto: CreateRiskDto): Promise<Risk> {
    // A. حساب الخطر الأساسي (Inherent)
    const riskRating = createRiskDto.impactScore * createRiskDto.likelihoodScore;
    const riskLevel = this.calculateRiskLevel(riskRating);
    
    let residualRiskRating: number | null = null;
    let residualRiskLevel: string | null = null;

    if (createRiskDto.residualImpactScore && createRiskDto.residualLikelihoodScore) {
      residualRiskRating = createRiskDto.residualImpactScore * createRiskDto.residualLikelihoodScore;
      residualRiskLevel = this.calculateRiskLevel(residualRiskRating);
    }

    const nextId = await this.generateNextRiskId();

    const initialTimeline: Partial<RiskTimeline> = {
      entryType: 'ACTION',
      text: `Risk created by System (Owner: ${createRiskDto.riskOwnerEmail})`,
      date: new Date() // يفضل إضافتها صراحة
    };

    const newRisk = new this.riskModel({
      ...createRiskDto, // 👈 دي هتنسخ الـ mitigationTasks كمان لو موجودة في الـ Schema
      riskCustomId: nextId,
      
      // القيم المحسوبة للـ Inherent
      riskRating,
      riskLevel,

      // القيم المحسوبة للـ Residual
      residualRiskRating,
      residualRiskLevel,

      timeline: [initialTimeline],
    });

    return await newRisk.save();
  }

  // 4️⃣ Read All
  async findAll() {
    return this.riskModel.find().sort({ createdAt: -1 }).exec();
  }

  // 5️⃣ Read One
  async findOne(id: string) {
    const risk = await this.riskModel.findById(id).exec();
    if (!risk) throw new NotFoundException(`Risk #${id} not found`);
    return risk;
  }

  // 6️⃣ Update: تحديث خطر
  async update(id: string, updateRiskDto: UpdateRiskDto): Promise<Risk> {
    const existingRisk = await this.riskModel.findById(id);
    if (!existingRisk) throw new NotFoundException(`Risk #${id} not found`);

    // 1️⃣ حساب الـ Inherent Risk (لو القيم اتغيرت)
    let newRating = existingRisk.riskRating;
    let newLevel = existingRisk.riskLevel;

    if (updateRiskDto.impactScore || updateRiskDto.likelihoodScore) {
      const impact = updateRiskDto.impactScore ?? existingRisk.impactScore;
      const likelihood = updateRiskDto.likelihoodScore ?? existingRisk.likelihoodScore;
      newRating = impact * likelihood;
      newLevel = this.calculateRiskLevel(newRating);
    }

    // 2️⃣ حساب الـ Residual Risk (لو القيم اتغيرت)
    let newResidualRating = existingRisk.residualRiskRating;
    let newResidualLevel = existingRisk.residualRiskLevel;

    if (updateRiskDto.residualImpactScore || updateRiskDto.residualLikelihoodScore) {
      const resImpact = updateRiskDto.residualImpactScore ?? existingRisk.residualImpactScore;
      const resLikelihood = updateRiskDto.residualLikelihoodScore ?? existingRisk.residualLikelihoodScore;
      
      // نحسب فقط لو القيمتين موجودين (سواء من القديم أو الجديد)
      if (resImpact && resLikelihood) {
        newResidualRating = resImpact * resLikelihood;
        newResidualLevel = this.calculateRiskLevel(newResidualRating);
      }
    }

    // 3️⃣ تجهيز التايم لاين
    const updateTimelineEntry: Partial<RiskTimeline> = {
      entryType: 'UPDATE',
      text: `Risk updated via API.`,
      date: new Date()
    };

    // 4️⃣ التنفيذ (التحديث الشامل)
    const updatedRisk = await this.riskModel.findByIdAndUpdate(
      id,
      {
        $set: { // ✅ بفضل استخدام $set صراحة مع Mongoose لضمان التحديث
           ...updateRiskDto, 
           riskRating: newRating,
           riskLevel: newLevel,
           residualRiskRating: newResidualRating,
           residualRiskLevel: newResidualLevel,
        },
        $push: { timeline: updateTimelineEntry },
      },
      { new: true, runValidators: true } // ✅ runValidators مهمة عشان يتأكد إن الأرقام من 1 لـ 5
    ).exec();

    if (!updatedRisk) throw new NotFoundException(`Risk #${id} not found`);
    return updatedRisk;
  }

  // أضيفي الدالة دي جوه كلاس RisksService

async updateStatus(id: string, status: RiskStatus): Promise<Risk> {
  const risk = await this.riskModel.findById(id);
  if (!risk) throw new NotFoundException(`Risk #${id} not found`);

  // لو الحالة هي هي، مفيش داعي نحدث
  if (risk.status === status) {
    return risk;
  }

  const oldStatus = risk.status;

  // تسجيل التغيير في التايم لاين
  const statusChangeTimeline: Partial<RiskTimeline> = {
    entryType: 'STATUS_CHANGE',
    text: `Status changed from '${oldStatus}' to '${status}'`, // جملة توضيحية
    date: new Date(),
  };

  // التحديث الفعلي
  risk.status = status;
  risk.timeline.push(statusChangeTimeline as RiskTimeline); // إضافة للتايم لاين

  return await risk.save();
}

  // 7️⃣ Delete
  async remove(id: string) {
    const deletedRisk = await this.riskModel.findByIdAndDelete(id).exec();
    if (!deletedRisk) throw new NotFoundException(`Risk #${id} not found`);
    return { message: 'Risk deleted successfully', id };
  }

  async getNextIdForDisplay() {
    return { nextId: await this.generateNextRiskId() };
  }
}