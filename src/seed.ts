import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ControlsService } from './controls/controls.service';
import { RisksService } from './risks/risks.service';

// استيراد الـ Enums (تأكدي من المسارات)
import { UserRole } from './users/entities/user.entity';
import { ControlType } from './controls/enums/control-type.enum';
import { RiskCategory } from './risks/enums/risk-category.enum';
import { RiskPriority } from './risks/enums/risk-priority.enum';
import { RiskTreatment } from './risks/enums/risk-treatment.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // استدعاء الخدمات
  const usersService = app.get(UsersService);
  const controlsService = app.get(ControlsService);
  const risksService = app.get(RisksService);

  console.log('🚀 Starting Database Seeding...\n');

  // ==========================================
  // 1. زراعة المستخدمين (Users)
  // ==========================================
  console.log('👤 Seeding Users...');
  
  const usersData = [
    {
      firstName: 'Admin', lastName: 'System', username: 'admin',
      email: 'admin@riscover.com', password: '123',
      role: UserRole.ADMIN, department: 'Management'
    },
    {
      firstName: 'Hassan', lastName: 'IT Manager', username: 'hassan_head',
      email: 'hassan@riscover.com', password: '123',
      role: UserRole.BU_HEAD, department: 'IT'
    },
    {
      firstName: 'Mona', lastName: 'HR Manager', username: 'mona_hr',
      email: 'mona@riscover.com', password: '123',
      role: UserRole.BU_HEAD, department: 'HR'
    },
    {
      firstName: 'Ali', lastName: 'Risk Owner', username: 'ali_it',
      email: 'ali@riscover.com', password: '123',
      role: UserRole.RISK_OWNER, department: 'IT'
    },
    {
      firstName: 'Sara', lastName: 'Compliance', username: 'sara_comp',
      email: 'sara@riscover.com', password: '123',
      role: UserRole.COMPLIANCE_MANAGER, department: 'Risk Dept'
    },
    // يوزر جديد عشان نستخدمه كمحلل أمني
    {
      firstName: 'Ramy', lastName: 'Analyst', username: 'ramy_sec',
      email: 'ramy@riscover.com', password: '123',
      role: UserRole.SECURITY_ANALYST, department: 'Cybersecurity'
    }
  ];

  // بنخزن اليوزرز اللي اتعملوا في Map عشان نستخدمهم تحت
  const usersMap: any = {};

  for (const user of usersData) {
    try {
      let existingUser: any = await usersService.findByUsername(user.username);
      if (!existingUser) {
        existingUser = await usersService.create(user as any);
        console.log(`✅ Created User: ${user.username}`);
      } else {
        console.log(`⚠️ User Exists: ${user.username}`);
      }
      usersMap[user.username] = existingUser;
    } catch (error) {
      console.error(`❌ Error creating ${user.username}:`, error.message);
    }
  }

  // ==========================================
  // 2. زراعة الضوابط (Controls)
  // ==========================================
  console.log('\n🛡️ Seeding Controls...');

  const controlsData = [
    { code: 'ISO-A.12.1', name: 'Ops Procedures', type: ControlType.PREVENTIVE, description: 'Documented operating procedures' },
    { code: 'PCI-FW-01', name: 'Firewall Config', type: ControlType.PREVENTIVE, description: 'Restrict inbound/outbound traffic' },
    { code: 'NIST-ID-1', name: 'Asset Inventory', type: ControlType.DETECTIVE, description: 'Maintain inventory of systems' },
    { code: 'DRP-01', name: 'Backup Recovery', type: ControlType.CORRECTIVE, description: 'Regular automated backups' }
  ];

  for (const control of controlsData) {
    try {
      await controlsService.create(control as any);
      console.log(`✅ Control: ${control.code}`);
    } catch (e) {
      console.log(`⚠️ Skipped Control: ${control.code}`);
    }
  }

  // ==========================================
  // 3. زراعة المخاطر (Risks) - بالشكل الجديد
  // ==========================================
  console.log('\n🔥 Seeding Risks (with new fields)...');

  const riskCreator = usersMap['ali_it']; // علي هو اللي هيسجل المخاطر

  if (riskCreator) {
    const risksData = [
      {
        title: 'Legacy Server Overheating',
        description: 'Main DB server AC is failing intermittently.',
        category: RiskCategory.OPERATIONAL,
        impact: 5,
        likelihood: 4,
        // الحقول الجديدة
        assetTags: ['Server', 'Data Center', 'Hardware'],
        affectedSystem: 'Core Database Server',
        riskOwnerEmail: 'hassan@riscover.com',
        securityAnalystEmail: 'ramy@riscover.com',
        priority: RiskPriority.CRITICAL,
        treatmentStrategy: RiskTreatment.MITIGATE,
        remediationPlan: 'Replace AC units and install temperature sensors.',
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
      },
      {
        title: 'Phishing Email Campaign',
        description: 'Employees clicking on suspicious links.',
        category: RiskCategory.SECURITY, // أو CYBERSECURITY حسب الـ Enum عندك
        impact: 4,
        likelihood: 5,
        assetTags: ['Email', 'Endpoints', 'Employees'],
        affectedSystem: 'Corporate Email',
        riskOwnerEmail: 'hassan@riscover.com',
        securityAnalystEmail: 'ramy@riscover.com',
        priority: RiskPriority.HIGH,
        treatmentStrategy: RiskTreatment.MITIGATE,
        remediationPlan: 'Conduct monthly phishing simulation.',
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString()
      },
      {
        title: 'GDPR Non-Compliance',
        description: 'Customer data retention policy not enforced.',
        category: RiskCategory.COMPLIANCE,
        impact: 5,
        likelihood: 2,
        assetTags: ['Policy', 'Customer Data'],
        affectedSystem: 'CRM System',
        riskOwnerEmail: 'mona@riscover.com',
        securityAnalystEmail: 'sara@riscover.com',
        priority: RiskPriority.MEDIUM,
        treatmentStrategy: RiskTreatment.ACCEPT, // نجرب واحدة Accept
        remediationPlan: 'Review legal requirements.',
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString()
      }
    ];

    for (const riskData of risksData) {
      try {
        // محاكاة اليوزر (req.user)
        const mockUser = { 
            userId: riskCreator._id, 
            department: riskCreator.department,
            email: riskCreator.email 
        };

        const newRisk = await risksService.create(riskData as any, mockUser);
        console.log(`✅ Risk Created: ${newRisk.siNo} - ${newRisk.title} (Score: ${newRisk.score})`);

      } catch (e) {
        // بنتجاهل الخطأ لو الخطر موجود (بسبب Unique siNo أحياناً لو العداد متصفرش)
        // بس الطبيعي في الـ Seed إنه يكمل
        console.log(`⚠️ Risk Creation Info: ${e.message}`);
      }
    }
  } else {
    console.log('❌ Error: Risk Creator (ali_it) not found.');
  }

  console.log('\n🌳 Seeding Complete!');
  await app.close();
}

bootstrap();