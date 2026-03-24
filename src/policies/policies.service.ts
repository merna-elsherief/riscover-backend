import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Policy, PolicyDocument, TimelineEventType } from './entities/policy.entity';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { AddTimelineEventDto } from './dto/add-timeline-event.dto';

@Injectable()
export class PoliciesService {
  constructor(
    @InjectModel(Policy.name) private policyModel: Model<PolicyDocument>,
  ) {}

  // 1. إرجاع الكود التالي للفرونت إند (مثال: PS-15)
  async getNextPolicyCodeForDisplay(): Promise<{ nextCode: string }> {
    const count = await this.policyModel.countDocuments();
    return { nextCode: `PS-${count + 1}` };
  }

  // 2. إنشاء Policy جديدة مع تسجيل أول خطوة في التايم لاين
  async create(createPolicyDto: CreatePolicyDto, userName: string = 'System User'): Promise<Policy> {
    const count = await this.policyModel.countDocuments();
    const generatedCode = `PS-${count + 1}`;

    const newPolicy = new this.policyModel({
      ...createPolicyDto,
      policyCode: generatedCode,
      timeline: [
        {
          type: TimelineEventType.SYSTEM,
          performedBy: userName,
          content: 'Policy drafted and created.',
          timestamp: new Date(),
        },
      ],
    });

    return newPolicy.save();
  }

  // 3. جلب كل السياسات
  async findAll(): Promise<Policy[]> {
    return this.policyModel.find().sort({ createdAt: -1 }).exec();
  }

  // 4. جلب سياسة واحدة بالـ ID
  async findOne(id: string): Promise<Policy> {
    const policy = await this.policyModel.findById(id).exec();
    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }
    return policy;
  }

  // 5. التحديث (مع تسجيل التغيير في التايم لاين أوتوماتيك لو الحالة اتغيرت)
  async update(id: string, updatePolicyDto: UpdatePolicyDto, userName: string = 'System User'): Promise<Policy> {
    const existingPolicy = await this.policyModel.findById(id);
    if (!existingPolicy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    // لو الحالة (Status) اتغيرت، سجل ده كـ System Event في التايم لاين
    if (updatePolicyDto.status && updatePolicyDto.status !== existingPolicy.status) {
      existingPolicy.timeline.push({
        type: TimelineEventType.SYSTEM,
        performedBy: userName,
        content: `Status changed from ${existingPolicy.status} to ${updatePolicyDto.status}`,
        timestamp: new Date(),
      });
    }

    Object.assign(existingPolicy, updatePolicyDto);
    return existingPolicy.save();
  }

  // 6. حذف سياسة
  async remove(id: string): Promise<any> {
    const result = await this.policyModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }
    return { message: 'Policy deleted successfully' };
  }

  // 7. 🔥 إضافة حدث للتايم لاين (تعليق، ملف من Cloudinary، أو لينك) 🔥
  async addTimelineEvent(id: string, eventDto: AddTimelineEventDto, userName: string): Promise<Policy> {
    const policy = await this.policyModel.findById(id);
    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    // إضافة الحدث الجديد في مصفوفة التايم لاين
    policy.timeline.push({
      type: eventDto.type,
      performedBy: userName,
      content: eventDto.content,
      fileName: eventDto.fileName,
      fileUrl: eventDto.fileUrl, // هنا هيتحفظ اللينك اللي راجع من Cloudinary
      timestamp: new Date(),
    });

    // حفظ التعديلات في قاعدة البيانات
    return policy.save();
  }
}