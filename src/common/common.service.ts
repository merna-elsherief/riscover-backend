import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter } from './counter.schema';

@Injectable()
export class CommonService {
  constructor(@InjectModel(Counter.name) private counterModel: Model<Counter>) {}

  async getNextSequence(counterName: string): Promise<number> {
    // الدالة دي بتعمل حاجتين في ضربة واحدة (Atomic Operation):
    // 1. بتدور على العداد وتزوده 1 ($inc)
    // 2. لو مش موجود بتعمله (upsert: true)
    // 3. وبترجع الرقم الجديد (new: true)
    
    const counter = await this.counterModel.findOneAndUpdate(
      { name: counterName },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    
    return counter.seq;
  }

  async peekNextSequence(counterName: string): Promise<number> {
  const counter = await this.counterModel.findOne({ name: counterName });
  // لو العداد موجود، رجعي الرقم الحالي + 1
  // لو مش موجود (لسه أول مرة)، رجعي 1
  return counter ? counter.seq + 1 : 1;
 }
}