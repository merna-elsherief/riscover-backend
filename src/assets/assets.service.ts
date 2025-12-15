import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAssetDto } from './dto/create-asset.dto';
import { Asset } from './entities/asset.entity';
import { CommonService } from '../common/common.service'; // استيراد خدمة العداد

@Injectable()
export class AssetsService {
  constructor(
    @InjectModel(Asset.name) private assetModel: Model<Asset>,
    private commonService: CommonService,
  ) {}

  // ==========================================
  // 1. Create with Auto-ID Logic
  // ==========================================
  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    // أ) نجيب الرقم التسلسلي ونزود العداد
    const seqNum = await this.commonService.getNextSequence('assets');
    
    // ب) نحسب السنة الحالية
    const currentYear = new Date().getFullYear();

    // ج) نكون الكود: AST-2025-001
    const assetId = `AST-${currentYear}-${seqNum.toString().padStart(3, '0')}`;

    // د) إنشاء وحفظ الأصل
    const newAsset = new this.assetModel({
      ...createAssetDto,
      assetId, // بنضيف الكود اللي حسبناه
    });

    return newAsset.save();
  }

  // ==========================================
  // 2. ID Preview (للعرض فقط)
  // ==========================================
  async getNextId(): Promise<{ nextId: string }> {
    // بنبص على العداد من غير ما نزوده (Peek)
    const seqNum = await this.commonService.peekNextSequence('assets');
    const currentYear = new Date().getFullYear();
    const formattedId = `AST-${currentYear}-${seqNum.toString().padStart(3, '0')}`;
    
    return { nextId: formattedId };
  }

  // ==========================================
  // 3. Find Operations
  // ==========================================
  async findAll(): Promise<Asset[]> {
    return this.assetModel.find()
      .populate('owner', 'firstName lastName email department') // هات بيانات المالك
      .populate('custodian', 'firstName lastName') // هات بيانات العهدة
      .sort({ createdAt: -1 }) // الأحدث أولاً
      .exec();
  }

  async findOne(id: string): Promise<Asset> {
    const asset = await this.assetModel.findById(id)
      .populate('owner', 'firstName lastName email')
      .populate('custodian', 'firstName lastName email')
      .exec();

    if (!asset) {
      throw new NotFoundException(`Asset #${id} not found`);
    }

    return asset;
  }

  // (اختياري) Update
  async update(id: string, updateDto: any): Promise<Asset> {
    const updatedAsset = await this.assetModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!updatedAsset) {
      throw new NotFoundException(`Asset #${id} not found`);
    }
    return updatedAsset;
  }

  // (اختياري) Delete
  async remove(id: string): Promise<void> {
    const result = await this.assetModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Asset #${id} not found`);
    }
  }
}