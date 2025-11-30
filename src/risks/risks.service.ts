import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskStatusDto } from './dto/update-risk-status.dto';
import { FilterRiskDto } from './dto/filter-risk.dto';
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

  async create(createRiskDto: CreateRiskDto, user: any): Promise<Risk> {
    const seqNum = await this.commonService.getNextSequence('risks');
    const currentYear = new Date().getFullYear();
    const formattedId = `R-${currentYear}-${seqNum.toString().padStart(3, '0')}`;

    const newRisk = new this.riskModel({
      ...createRiskDto, // ده هينسخ الـ Tasks وكل حاجة لوحدها
      siNo: formattedId,
      createdBy: user.userId,
      timeline: [{
        user: user.userId,
        action: 'Created',
        details: `Risk registered by ${user.email}`,
        timestamp: new Date()
      }]
    });
    return newRisk.save();
  }

  async getNextId() {
    const seqNum = await this.commonService.peekNextSequence('risks');
    const currentYear = new Date().getFullYear();
    return { nextId: `R-${currentYear}-${seqNum.toString().padStart(3, '0')}` };
  }

  async findAll(filters: FilterRiskDto): Promise<Risk[]> {
    const query: any = {};
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }
    if (filters.status) query.status = filters.status;

    return this.riskModel.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Risk> {
    const risk = await this.riskModel.findById(id)
      .populate('createdBy', 'firstName lastName email')
      .populate('timeline.user', 'firstName lastName')
      .exec();
    if (!risk) throw new NotFoundException('Risk not found');
    return risk;
  }

  async updateStatus(id: string, updateDto: UpdateRiskStatusDto, user: any): Promise<Risk> {
    const risk = await this.riskModel.findById(id);
    if (!risk) throw new NotFoundException('Risk not found');

    if (updateDto.status === RiskStatus.ACCEPTED) {
      const isAuthorized = user.role === UserRole.BU_HEAD || user.role === UserRole.ADMIN;
      if (!isAuthorized) throw new ForbiddenException('Only BU Heads can accept risks');
    }

    const oldStatus = risk.status;
    risk.status = updateDto.status;
    if (updateDto.justification) risk.acceptanceJustification = updateDto.justification;

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

  async getDashboardStats() {
    const stats = await this.riskModel.aggregate([
      {
        $group: {
          _id: null,
          totalRisks: { $sum: 1 },
          avgScore: { $avg: '$score' },
          draftCount: { $sum: { $cond: [{ $eq: ['$status', 'Draft'] }, 1, 0] } },
          openCount: { $sum: { $cond: [{ $ne: ['$status', 'Closed'] }, 1, 0] } },
          criticalCount: { $sum: { $cond: [{ $gte: ['$score', 20] }, 1, 0] } }
        }
      }
    ]);
    return stats[0] || { totalRisks: 0 };
  }
}