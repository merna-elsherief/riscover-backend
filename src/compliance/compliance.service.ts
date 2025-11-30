import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Framework } from './entities/framework.entity';
// تصحيح الاستيراد: Control من الـ Entity، و ControlStatus من الـ Enum
import { Control } from '../controls/entities/control.entity';
import { ControlStatus } from '../controls/enums/control-status.enum'; 

@Injectable()
export class ComplianceService {
  constructor(
    @InjectModel(Framework.name) private frameworkModel: Model<Framework>,
    @InjectModel(Control.name) private controlModel: Model<Control>,
  ) {}

  async create(createDto: any) {
    return this.frameworkModel.create(createDto);
  }

  // دالة حساب الداشبورد
  async getDashboardStats() {
    const frameworks = await this.frameworkModel.find().lean();
    
    // تصحيح الخطأ الثاني: لازم نحدد نوع المصفوفة إنها بتقبل أي أوبجكت
    const stats: any[] = []; 

    for (const fw of frameworks) {
      // 1. إجمالي الضوابط للمعيار ده
      const total = await this.controlModel.countDocuments({ framework: fw.name });
      
      // 2. الضوابط المنفذة
      const implemented = await this.controlModel.countDocuments({ 
        framework: fw.name, 
        status: ControlStatus.IMPLEMENTED // دلوقتي هيقرأ الـ Enum صح
      });

      // 3. النسبة المئوية
      const score = total > 0 ? Math.round((implemented / total) * 100) : 0;

      stats.push({
        framework: fw.name,
        description: fw.description,
        totalControls: total,
        implementedCount: implemented,
        score: score 
      });
    }
    return stats;
  }
}