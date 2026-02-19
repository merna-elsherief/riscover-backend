import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// --- Risks Imports ---
import { RisksService } from './risks/risks.service';
import { CreateRiskDto } from './risks/dto/create-risk.dto';
import { RiskStatus } from './risks/entities/risk.entity';

// --- Policies Imports ---
import { PoliciesService } from './policies/policies.service';
import { CreatePolicyDto } from './policies/dto/create-policy.dto';
import { DocumentType, PolicyStatus, PolicyPriority } from './policies/entities/policy.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  // تعريف السيرفيسز
  const risksService = app.get(RisksService);
  const policiesService = app.get(PoliciesService);

  // ==========================================================
  // 1️⃣ مسح الداتا القديمة بالكامل (عشان نبدأ على نضافة) 🧹
  // ==========================================================
  console.log('🧹 Cleaning old database records...');
  
  // الوصول للموديلز عشان نمسح منها
  const riskModel = (risksService as any).riskModel; 
  const policyModel = (policiesService as any).policyModel;

  // مسح كل الـ Risks والـ Policies
  await riskModel.deleteMany({}); 
  await policyModel.deleteMany({});
  
  console.log('✅ Old data deleted successfully!');

  // ==========================================================
  // 2️⃣ بيانات المخاطر (Risks)
  // ==========================================================
  const risksToSeed: CreateRiskDto[] = [
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
      
      impactScore: 5,
      likelihoodScore: 5, 
      
      residualImpactScore: 5,
      residualLikelihoodScore: 1, 
      
      treatmentOption: 'Mitigate',
      remediationPlan: 'Apply firmware patch v2.4 immediately.',
      remediationPlanSummary: 'Firmware Update',
      resourcesRequired: 'DevOps Team, 2 Hours Downtime',
      
      autoReminders: true,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // بعد اسبوع
      
      status: RiskStatus.IN_PROGRESS,
      mitigationTasks: [
        {
          title: 'Backup Full Database',
          assigneeEmail: 'admin@bank.com',
          dueDate: new Date().toISOString()
        },
        {
          title: 'Install Firmware Patch v2.4',
          assigneeEmail: 'devops@bank.com',
          dueDate: new Date().toISOString()
        }
      ]
    },
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
      
      treatmentOption: 'Accept', 
      remediationPlan: 'Hire 5 part-time agents for next quarter.',
      
      autoReminders: false,
      dueDate: new Date('2025-12-31').toISOString(),
      
      status: RiskStatus.DRAFT, 
      mitigationTasks: [] 
    },
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
      dueDate: new Date('2025-06-30').toISOString(),

      status: RiskStatus.CLOSED, 
      
      mitigationTasks: [
        {
          title: 'Review Vendor SLA',
          assigneeEmail: 'legal@bank.com',
          dueDate: new Date('2024-01-01').toISOString()
        }
      ]
    }
  ];

  // ==========================================================
  // 3️⃣ بيانات السياسات (Policies)
  // ==========================================================
  const policiesToSeed: CreatePolicyDto[] = [
    {
      title: 'Information Security Manual',
      description: 'The purpose of this manual is to specify the requirements for establishing, implementing, monitoring, reviewing, maintaining, and improving the ISMS.',
      documentType: DocumentType.POLICY,
      assigneeName: 'Khaled Alaa',
      assigneeEmail: 'khaled@company.com',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(), // بعد اسبوعين
      status: PolicyStatus.SUBMIT_FOR_REVIEW,
      priority: PolicyPriority.HIGH,
      progress: 90,
      isPublished: false,
      tags: ['ISMS', 'ISO 27001'],
      participants: ['sec-team@company.com', 'cto@company.com']
    },
    {
      title: 'Access Control Standard',
      description: 'Defines the standard requirements for logical and physical access control across the organization.',
      documentType: DocumentType.STANDARD,
      assigneeName: 'Mary Johnson',
      assigneeEmail: 'mary.j@company.com',
      dueDate: new Date('2025-12-31').toISOString(),
      status: PolicyStatus.OPEN,
      priority: PolicyPriority.CRITICAL,
      progress: 100,
      isPublished: true,
      tags: ['Access Control', 'Identity'],
      participants: ['hr@company.com', 'it-admin@company.com']
    },
    {
      title: 'Remote Work Guideline',
      description: 'Guidelines for employees working remotely to ensure data protection and secure access.',
      documentType: DocumentType.GUIDELINE,
      assigneeName: 'Ahmed Ali',
      assigneeEmail: 'a.ali@company.com',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(), // بعد شهر
      status: PolicyStatus.DRAFT,
      priority: PolicyPriority.MEDIUM,
      progress: 20,
      isPublished: false,
      tags: ['Remote Work', 'HR'],
      participants: ['all-employees@company.com']
    }
  ];

  console.log('🌱 Seeding started...');

  // --- Seeding Risks ---
  console.log('\n--- Seeding Risks ---');
  for (const risk of risksToSeed) {
    const createdRisk = await risksService.create(risk);
    console.log(`✅ Created Risk: ${createdRisk.riskCustomId} | ${createdRisk.riskName}`);
  }

  // --- Seeding Policies ---
  console.log('\n--- Seeding Policies ---');
  for (const policy of policiesToSeed) {
    const createdPolicy = await policiesService.create(policy, 'System Seeder');
    console.log(`✅ Created Policy: ${createdPolicy.policyCode} | ${createdPolicy.title}`);
  }

  console.log('\n🚀 Seeding complete! Database is fresh and ready to use.');
  await app.close();
}

bootstrap();