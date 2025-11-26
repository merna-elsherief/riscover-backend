import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ControlsService } from './controls/controls.service';
import { RisksService } from './risks/risks.service';

// استيراد الـ Enums
import { UserRole } from './users/entities/user.entity';
import { ControlType } from './controls/enums/control-type.enum';
import { RiskCategory } from './risks/enums/risk-category.enum';

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
    }
  ];

  // بنخزن اليوزرز اللي اتعملوا عشان نستخدمهم في المخاطر
  const createdUsers: any = {};

  for (const user of usersData) {
    try {
      // بنحاول نجيب اليوزر الأول لو موجود
      let existingUser : any = await usersService.findByUsername(user.username);
      
      if (!existingUser) {
        // لو مش موجود نكريته
        existingUser = await usersService.create(user as any);
        console.log(`✅ Created: ${user.username}`);
      } else {
        console.log(`⚠️ Exists: ${user.username}`);
      }
      createdUsers[user.username] = existingUser;

    } catch (error) {
      console.error(`❌ Error creating ${user.username}:`, error.message);
    }
  }

  // ==========================================
  // 2. زراعة الضوابط (Controls)
  // ==========================================
  console.log('\n🛡️ Seeding Controls...');

  const controlsData = [
    {
      code: 'ISO-A.12.1', name: 'Ops Procedures', type: ControlType.PREVENTIVE,
      description: 'Documented operating procedures'
    },
    {
      code: 'PCI-FW-01', name: 'Firewall Config', type: ControlType.PREVENTIVE,
      description: 'Restrict inbound and outbound traffic'
    },
    {
      code: 'NIST-ID-1', name: 'Asset Inventory', type: ControlType.DETECTIVE,
      description: 'Maintain inventory of all systems'
    },
    {
      code: 'DRP-01', name: 'Backup Recovery', type: ControlType.CORRECTIVE,
      description: 'Regular automated backups'
    }
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
  // 3. زراعة المخاطر (Risks)
  // ==========================================
  console.log('\n🔥 Seeding Initial Risks...');

  const riskOwner = createdUsers['ali_it']; // علي هو اللي هيعمل المخاطر

  if (riskOwner) {
    const risksData = [
      {
        title: 'Server Room Overheating',
        description: 'AC units are old and might fail during summer.',
        category: RiskCategory.OPERATIONAL,
        likelihood: 4,
        impact: 5,
        identifiedDate: new Date().toISOString(), // تاريخ النهاردة
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString() // كمان شهر
      },
      {
        title: 'Phishing Attack Susceptibility',
        description: 'Employees are clicking on suspicious emails.',
        category: RiskCategory.CYBERSECURITY,
        likelihood: 5,
        impact: 4,
        identifiedDate: new Date().toISOString(),
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString()
      }
    ];

    for (const riskData of risksData) {
      try {
        // هنا بننادي السيرفيس كأننا "علي"
        // لازم نبعت اليوزر كأوبجكت زي ما الـ Controller بيعمل (req.user)
        const mockUser = { 
            userId: riskOwner._id, 
            department: riskOwner.department 
        };

        // الدالة دي هتعمل الـ siNo والـ Timeline والـ Score لوحدها
        const newRisk = await risksService.create(riskData as any, mockUser);
        console.log(`✅ Risk Created: ${newRisk.siNo} - ${newRisk.title}`);

      } catch (e) {
        console.log(`⚠️ Risk Creation Failed: ${e.message}`);
        // غالباً هيفشل لو نفس الـ siNo موجود، وده طبيعي في التكرار
      }
    }
  } else {
    console.log('❌ Skipping Risks: Risk Owner (ali_it) not found.');
  }

  console.log('\n🌳 Seeding Complete!');
  await app.close();
}

bootstrap();