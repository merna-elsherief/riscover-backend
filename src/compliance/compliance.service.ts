import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Framework } from './entities/framework.entity';
import { CreateFrameworkDto } from './dto/create-framework.dto'; // (اعمليه بسيط زي المرات اللي فاتت)
// استيراد موديل الضوابط وحالة التنفيذ
import { Control } from '../controls/entities/control.entity';
import { ControlStatus } from '../controls/enums/control-status.enum';

@Injectable()
export class ComplianceService {
  constructor(
    @InjectModel(Framework.name) private frameworkModel: Model<Framework>,
    // 💉 حقن موديل الضوابط (عشان نعدهم)
    @InjectModel(Control.name) private controlModel: Model<Control>, 
  ) {}

  async create(createDto: CreateFrameworkDto) {
    return this.frameworkModel.create(createDto);
  }

  // 🔥 دي أهم دالة في المشروع كله (Dashboard Data)
  async getDashboardStats() {
    // 1. هات كل المعايير (ISO, PCI...)
    const frameworks = await this.frameworkModel.find().lean();
    
    const stats: any[] = [];

    for (const fw of frameworks) {
      // 2. عد كل الضوابط اللي اسم الـ framework بتاعها بيساوي اسم المعيار ده
      const total = await this.controlModel.countDocuments({ framework: fw.name });
      
      // 3. عد الضوابط اللي حالتها Implemented بس
      const implemented = await this.controlModel.countDocuments({ 
        framework: fw.name, 
        status: ControlStatus.IMPLEMENTED 
      });

      // 4. احسب النسبة المئوية (تجنب القسمة على صفر)
      const score = total > 0 ? Math.round((implemented / total) * 100) : 0;

      stats.push({
        frameworkId: fw._id,
        name: fw.name,
        description: fw.description,
        totalControls: total,
        implementedControls: implemented,
        complianceScore: score // الرقم ده اللي بيترسم في الدايرة (e.g., 86)
      });
    }

    return stats;
  }

  async findAll() {
    return this.frameworkModel.find().exec();
  }
}