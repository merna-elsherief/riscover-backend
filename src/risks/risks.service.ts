import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Risk, RiskDocument, RiskTimeline } from './entities/risk.entity';
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

  // 2️⃣ دالة حساب مستوى الخطر
  private calculateRiskLevel(rating: number): string {
    if (rating >= 16) return 'Critical';
    if (rating >= 12) return 'High';
    if (rating >= 6) return 'Medium';
    return 'Low';
  }

  // 3️⃣ Create: إنشاء خطر جديد
  async create(createRiskDto: CreateRiskDto): Promise<Risk> {
    const riskRating = createRiskDto.impactScore * createRiskDto.likelihoodScore;
    const riskLevel = this.calculateRiskLevel(riskRating);
    const nextId = await this.generateNextRiskId();

    const initialTimeline: Partial<RiskTimeline> = {
      entryType: 'ACTION',
      text: `Risk created by System (Owner: ${createRiskDto.riskOwnerEmail})`,
    };

    const newRisk = new this.riskModel({
      ...createRiskDto, // 👈 دي بتنسخ كل الحقول (Priority, Description, etc.)
      riskCustomId: nextId,
      riskRating,
      riskLevel,
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

  // 6️⃣ Update: تحديث خطر (شامل كل الحقول)
  async update(id: string, updateRiskDto: UpdateRiskDto): Promise<Risk> {
    const existingRisk = await this.riskModel.findById(id);
    if (!existingRisk) throw new NotFoundException(`Risk #${id} not found`);

    let newRating = existingRisk.riskRating;
    let newLevel = existingRisk.riskLevel;

    // إعادة الحساب فقط لو القيم الرقمية اتغيرت
    if (updateRiskDto.impactScore || updateRiskDto.likelihoodScore) {
      const impact = updateRiskDto.impactScore ?? existingRisk.impactScore;
      const likelihood = updateRiskDto.likelihoodScore ?? existingRisk.likelihoodScore;
      newRating = impact * likelihood;
      newLevel = this.calculateRiskLevel(newRating);
    }

    const updateTimelineEntry: Partial<RiskTimeline> = {
      entryType: 'UPDATE',
      text: `Risk updated via API.`,
    };

    const updatedRisk = await this.riskModel.findByIdAndUpdate(
      id,
      {
        ...updateRiskDto, // 👈 السطر ده هو اللي بيحدث الـ Description والـ Priority وأي حقل جديد
        riskRating: newRating,
        riskLevel: newLevel,
        $push: { timeline: updateTimelineEntry },
      },
      { new: true }
    ).exec();

    if (!updatedRisk) throw new NotFoundException(`Risk #${id} not found`);
    return updatedRisk;
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