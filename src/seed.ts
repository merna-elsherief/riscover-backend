import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RisksService } from './risks/risks.service';
import { CreateRiskDto } from './risks/dto/create-risk.dto';
import { RiskStatus } from './risks/entities/risk.entity'; // ✅ استيراد الـ Enum

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const risksService = app.get(RisksService);

  // 1. تنظيف الداتا القديمة (اختياري - شيلي الكومنت لو عايزة تمسحي كله وتبدأي من جديد)
  // const model = risksService['riskModel']; // الوصول للموديل
  // await model.deleteMany({}); 
  // console.log('🧹 Old data cleaned...');

  const risksToSeed: CreateRiskDto[] = [
    // 🔴 الحالة الأولى: خطر حرج (Critical) - فيه Tasks و Residuals
    {
      riskName: 'Main Database Corruption',
      description: 'Potential corruption of the core banking ledger due to faulty storage controller firmware.',
      category: 'Technical',
      impactedSystem: 'Core Banking DB',
      priority: 'Critical',
      assetTags: ['Storage', 'Database', 'Server Room A'],
      
      riskOwnerEmail: 'cto@bank.com',
      securityAnalystEmail: 'sec-ops@bank.com',
      existingControl: 'Daily Snapshots',
      
      // Inherent Risk (الأساسي)
      impactScore: 5,
      likelihoodScore: 5, 
      
      // ✅ Residual Risk (المتوقع بعد الحل)
      residualImpactScore: 5,    // التأثير هيفضل عالي
      residualLikelihoodScore: 1, // بس الاحتمالية هتقل جداً
      
      treatmentOption: 'Mitigate',
      remediationPlan: 'Apply firmware patch v2.4 immediately.',
      remediationPlanSummary: 'Firmware Update',
      resourcesRequired: 'DevOps Team, 2 Hours Downtime',
      
      autoReminders: true,
      // ✅ الحل هنا: حولنا التاريخ لنص
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // بعد اسبوع
      
      // ✅ الحالة والتاسكات
      status: RiskStatus.IN_PROGRESS,
      mitigationTasks: [
        {
          title: 'Backup Full Database',
          assigneeEmail: 'admin@bank.com',
          // ✅ الحل هنا: حولنا التاريخ لنص
          dueDate: new Date().toISOString()
        },
        {
          title: 'Install Firmware Patch v2.4',
          assigneeEmail: 'devops@bank.com',
          // ✅ الحل هنا: حولنا التاريخ لنص
          dueDate: new Date().toISOString()
        }
      ]
    },

    // 🟠 الحالة الثانية: خطر متوسط (Medium) - مقبول (Accept)
    {
      riskName: 'Insufficient Call Center Staff',
      description: 'High wait times during peak hours leading to customer dissatisfaction.',
      category: 'Operational',
      impactedSystem: 'CRM Portal',
      priority: 'Medium',
      assetTags: ['Human Resources', 'CRM'],
      
      riskOwnerEmail: 'head.support@bank.com',
      securityAnalystEmail: 'risk.compliance@bank.com',
      existingControl: 'Standard Shifts',
      
      impactScore: 3,
      likelihoodScore: 3,
      
      // مفيش Residual هنا لأننا قبلنا الخطر ومش هنعمل Mitigation قوي
      
      treatmentOption: 'Accept', 
      remediationPlan: 'Hire 5 part-time agents for next quarter.',
      
      autoReminders: false,
      // ✅ الحل هنا: حولنا التاريخ لنص
      dueDate: new Date('2025-12-31').toISOString(),
      
      status: RiskStatus.DRAFT, // لسه درافت
      mitigationTasks: [] // مفيش تاسكات
    },

    // 🟢 الحالة الثالثة: خطر منخفض (Low) - تم إغلاقه (Closed)
    {
      riskName: 'Marketing Email Vendor Delay',
      description: 'Vendor API occasionally times out (less than 1% of requests).',
      category: 'Third Party',
      impactedSystem: 'Email Gateway',
      priority: 'Low',
      
      riskOwnerEmail: 'marketing@bank.com',
      securityAnalystEmail: 'vendor.mgt@bank.com',
      existingControl: 'Retry Mechanism',
      
      impactScore: 2,
      likelihoodScore: 2,
      
      treatmentOption: 'Avoid',
      remediationPlan: 'Switch to backup provider if error rate exceeds 2%.',
      
      autoReminders: true,
      // ✅ الحل هنا: حولنا التاريخ لنص
      dueDate: new Date('2025-06-30').toISOString(),

      status: RiskStatus.CLOSED, // ✅ مقفول
      
      // تاسك واحدة واتقفلت مثلاً (نظرياً)
      mitigationTasks: [
        {
          title: 'Review Vendor SLA',
          assigneeEmail: 'legal@bank.com',
          // ✅ الحل هنا: حولنا التاريخ لنص
          dueDate: new Date('2024-01-01').toISOString()
        }
      ]
    }
  ];

  console.log('🌱 Seeding started...');

  for (const risk of risksToSeed) {
    // السيرفس هتقوم بالواجب: (ID generation, Calculation, Saving)
    const createdRisk = await risksService.create(risk);
    
    console.log(`✅ Created Risk: ${createdRisk.riskCustomId}`);
    console.log(`   └─ Name: ${createdRisk.riskName}`);
    console.log(`   └─ Level: ${createdRisk.riskLevel} | Status: ${createdRisk.status}`);
    
    if (createdRisk.residualRiskLevel) {
       console.log(`   └─ Residual Level: ${createdRisk.residualRiskLevel}`);
    }
    
    console.log(`   └─ Tasks: ${createdRisk.mitigationTasks.length}`);
    console.log('-----------------------------------');
  }

  console.log('🚀 Seeding complete!');
  await app.close();
}

bootstrap();