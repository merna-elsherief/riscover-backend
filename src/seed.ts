import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RisksService } from './risks/risks.service';
import { CreateRiskDto } from './risks/dto/create-risk.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const risksService = app.get(RisksService);

  // 1. تنظيف الداتا القديمة (اختياري)
  // await risksService['riskModel'].deleteMany({}); 
  // console.log('🧹 Old data cleaned...');

  const risksToSeed: CreateRiskDto[] = [
    // الحالة الأولى: خطر حرج جداً (Critical)
    {
      riskName: 'Main Database Corruption',
      description: 'Potential corruption of the core banking ledger due to faulty storage controller firmware.',
      category: 'Technical',
      impactedSystem: 'Core Banking DB',
      priority: 'Critical', // ✅ الحقل الجديد
      assetTags: ['Storage', 'Database', 'Server Room A'],
      
      riskOwnerEmail: 'cto@bank.com',
      securityAnalystEmail: 'sec-ops@bank.com',
      existingControl: 'Daily Snapshots',
      
      impactScore: 5,
      likelihoodScore: 5, 
      // Rating: 25 (Critical)
      
      treatmentOption: 'Mitigate',
      remediationPlan: 'Apply firmware patch v2.4 immediately and restore consistency check.',
      remediationPlanSummary: 'Firmware Update',
      resourcesRequired: 'DevOps Team, 2 Hours Downtime',
      
      autoReminders: true, // ✅ الحقل الجديد
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // بعد اسبوع
    },

    // الحالة الثانية: خطر متوسط (Medium) - تشغيلي
    {
      riskName: 'Insufficient Call Center Staff',
      description: 'High wait times during peak hours leading to customer dissatisfaction.',
      category: 'Operational',
      impactedSystem: 'CRM Portal',
      priority: 'Medium', // ✅ الحقل الجديد
      assetTags: ['Human Resources', 'CRM'],
      
      riskOwnerEmail: 'head.support@bank.com',
      securityAnalystEmail: 'risk.compliance@bank.com',
      
      impactScore: 3,
      likelihoodScore: 3,
      // Rating: 9 (Medium)
      
      treatmentOption: 'Accept', // هنقبل الخطر ده مؤقتاً
      remediationPlan: 'Hire 5 part-time agents for next quarter.',
      
      autoReminders: false,
      dueDate: '2025-12-31',
    },

    // الحالة الثالثة: خطر منخفض (Low) - طرف ثالث
    {
      riskName: 'Marketing Email Vendor Delay',
      description: 'Vendor API occasionally times out (less than 1% of requests).',
      category: 'Third Party',
      impactedSystem: 'Email Gateway',
      priority: 'Low', // ✅ الحقل الجديد
      
      riskOwnerEmail: 'marketing@bank.com',
      securityAnalystEmail: 'vendor.mgt@bank.com',
      
      impactScore: 2,
      likelihoodScore: 2,
      // Rating: 4 (Low)
      
      treatmentOption: 'Avoid',
      remediationPlan: 'Switch to backup provider if error rate exceeds 2%.',
      
      autoReminders: true,
      dueDate: '2025-06-30',
    }
  ];

  console.log('🌱 Seeding started...');

  for (const risk of risksToSeed) {
    const createdRisk = await risksService.create(risk);
    console.log(`✅ Created Risk: ${createdRisk.riskCustomId}`);
    console.log(`   └─ Name: ${createdRisk.riskName}`);
    console.log(`   └─ Level: ${createdRisk.riskLevel} | Priority: ${createdRisk.priority}`);
    console.log(`   └─ Plan: ${createdRisk.remediationPlan ? 'Yes' : 'No'}`);
    console.log('-----------------------------------');
  }

  console.log('🚀 Seeding complete!');
  await app.close();
}

bootstrap();