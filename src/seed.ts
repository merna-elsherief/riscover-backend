import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ControlsService } from './controls/controls.service';
import { RisksService } from './risks/risks.service';
import { ComplianceService } from './compliance/compliance.service';

// Enums imports
import { UserRole } from './users/entities/user.entity';
import { ControlType } from './controls/enums/control-type.enum';
import { ControlStatus } from './controls/enums/control-status.enum';
import { RiskCategory } from './risks/enums/risk-category.enum';
import { RiskPriority } from './risks/enums/risk-priority.enum';
import { RiskTreatment } from './risks/enums/risk-treatment.enum';
import { RiskStatus } from './risks/enums/risk-status.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const controlsService = app.get(ControlsService);
  const risksService = app.get(RisksService);
  const complianceService = app.get(ComplianceService);

  console.log('🚀 Starting ULTIMATE GRC Seeding...\n');

  // ==========================================
  // 1. Users (The Team) 👤
  // ==========================================
  console.log('👤 Creating Users...');
  
  const usersData = [
    // Admin & Board
    { firstName: 'Admin', lastName: 'System', username: 'admin', email: 'admin@riscover.com', role: UserRole.ADMIN, department: 'Board' },
    
    // Business Unit Heads (Approvers)
    { firstName: 'Hassan', lastName: 'El-Sayed', username: 'head_it', email: 'hassan@riscover.com', role: UserRole.BU_HEAD, department: 'IT' },
    { firstName: 'Mona', lastName: 'Zaki', username: 'head_hr', email: 'mona@riscover.com', role: UserRole.BU_HEAD, department: 'HR' },
    { firstName: 'Khaled', lastName: 'Salem', username: 'head_fin', email: 'khaled@riscover.com', role: UserRole.BU_HEAD, department: 'Finance' },

    // Risk Owners (Creators)
    { firstName: 'Sarah', lastName: 'Johnson', username: 'sarah_it', email: 'sarah@riscover.com', role: UserRole.RISK_OWNER, department: 'IT' },
    { firstName: 'Mike', lastName: 'Ross', username: 'mike_fin', email: 'mike@riscover.com', role: UserRole.RISK_OWNER, department: 'Finance' },
    
    // Security Analyst
    { firstName: 'Ramy', lastName: 'Adel', username: 'ramy_sec', email: 'ramy@riscover.com', role: UserRole.SECURITY_ANALYST, department: 'Cybersecurity' }
  ];

  const usersMap: any = {};
  
  for (const u of usersData) {
    try {
      let user: any = await usersService.findByUsername(u.username);
      if (!user) {
        user = await usersService.create({ ...u, password: '123' } as any); // Password for everyone
        console.log(`✅ User Created: ${u.username}`);
      }
      usersMap[u.username] = user;
    } catch (e) { console.log(`⚠️ User Skip: ${u.username}`); }
  }

  // ==========================================
  // 2. Compliance Frameworks 📊
  // ==========================================
  console.log('\n📊 Creating Frameworks...');

  const frameworks = [
    { name: 'ISO 27001', description: 'Information Security Management System', type: 'Security' },
    { name: 'PCI DSS', description: 'Payment Card Industry Security Standard', type: 'Financial' },
    { name: 'GDPR', description: 'General Data Protection Regulation', type: 'Privacy' },
    { name: 'SOC 2', description: 'Service Organization Control 2', type: 'Security' }
  ];

  for (const fw of frameworks) {
    try { await complianceService.create(fw); console.log(`✅ Framework: ${fw.name}`); } 
    catch (e) {}
  }

  // ==========================================
  // 3. Controls Library (Mixed Statuses) 🛡️
  // ==========================================
  console.log('\n🛡️ Creating Controls...');

  const controls = [
    // --- ISO 27001 (Mix of Implemented & In Progress) ---
    { 
      code: 'A.8.1.1', name: 'Inventory of Assets', framework: 'ISO 27001', 
      status: ControlStatus.IMPLEMENTED, type: ControlType.PREVENTIVE, 
      description: 'Assets associated with information... identified.' 
    },
    { 
      code: 'A.12.3', name: 'Backup', framework: 'ISO 27001', 
      status: ControlStatus.IMPLEMENTED, type: ControlType.CORRECTIVE, 
      description: 'Backup copies of information... shall be taken.' 
    },
    { 
      code: 'A.9.2', name: 'User Access Provisioning', framework: 'ISO 27001', 
      status: ControlStatus.IN_PROGRESS, type: ControlType.PREVENTIVE, 
      description: 'Formal user registration process.' 
    },
    { 
      code: 'A.16.1', name: 'Incident Management', framework: 'ISO 27001', 
      status: ControlStatus.NOT_STARTED, type: ControlType.CORRECTIVE, 
      description: 'Management of information security incidents.' 
    },

    // --- PCI DSS (Mostly Implemented) ---
    { 
      code: 'PCI-1.1', name: 'Firewall Config', framework: 'PCI DSS', 
      status: ControlStatus.IMPLEMENTED, type: ControlType.PREVENTIVE, 
      description: 'Install and maintain a firewall configuration.' 
    },
    { 
      code: 'PCI-3.1', name: 'Protect Card Data', framework: 'PCI DSS', 
      status: ControlStatus.IMPLEMENTED, type: ControlType.PREVENTIVE, 
      description: 'Protect stored cardholder data.' 
    },

    // --- GDPR (Poor Compliance) ---
    { 
      code: 'GDPR-Art-32', name: 'Security of Processing', framework: 'GDPR', 
      status: ControlStatus.NOT_STARTED, type: ControlType.DETECTIVE, 
      description: 'Implement technical and organisational measures.' 
    },
    { 
      code: 'GDPR-Art-17', name: 'Right to Erasure', framework: 'GDPR', 
      status: ControlStatus.IN_PROGRESS, type: ControlType.CORRECTIVE, 
      description: 'The right to be forgotten.' 
    }
  ];

  for (const c of controls) {
    try { await controlsService.create(c as any); console.log(`✅ Control: ${c.code}`); } 
    catch (e) {}
  }

  // ==========================================
  // 4. Risks Scenarios (The Big Part) 🔥
  // ==========================================
  console.log('\n🔥 Creating Risk Scenarios...');

  const scenarios = [
    // 1. Critical Security Risk (With Tasks)
    {
      creator: 'sarah_it',
      data: {
        title: 'Ransomware Attack Susceptibility',
        description: 'Vulnerability in legacy Windows 2012 servers.',
        category: RiskCategory.SECURITY,
        affectedSystem: 'Core ERP',
        assetTags: ['Servers', 'Windows 2012', 'Data Center'],
        impact: 5, likelihood: 5, // Score 25 (Critical)
        
        riskOwnerEmail: 'hassan@riscover.com',
        securityAnalystEmail: 'ramy@riscover.com',
        priority: RiskPriority.CRITICAL,
        treatmentStrategy: RiskTreatment.MITIGATE,
        remediationPlanDescription: 'Decommission legacy servers and migrate to Cloud.',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        tasks: [
          { title: 'Server Audit', assignee: 'SysAdmin', status: 'Completed', dueDate: '2025-09-01' },
          { title: 'Migration Plan', assignee: 'Cloud Team', status: 'In Progress', dueDate: '2025-10-01' }
        ]
      }
    },
    // 2. High Operational Risk
    {
      creator: 'sarah_it',
      data: {
        title: 'Cloud Service Outage (Single AZ)',
        description: 'No redundancy for the main application database.',
        category: RiskCategory.OPERATIONAL,
        affectedSystem: 'Customer Portal',
        assetTags: ['AWS', 'RDS', 'Database'],
        impact: 5, likelihood: 3, // Score 15 (High)
        
        riskOwnerEmail: 'hassan@riscover.com',
        securityAnalystEmail: 'ramy@riscover.com',
        priority: RiskPriority.HIGH,
        treatmentStrategy: RiskTreatment.MITIGATE,
        remediationPlanDescription: 'Enable Multi-AZ deployment.',
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString(),
        tasks: []
      }
    },
    // 3. Medium Financial Risk
    {
      creator: 'mike_fin',
      data: {
        title: 'Manual Reporting Errors',
        description: 'Excel-based reporting leads to data integrity issues.',
        category: RiskCategory.FINANCIAL,
        affectedSystem: 'Financial Reports',
        assetTags: ['Excel', 'Finance'],
        impact: 4, likelihood: 3, // Score 12 (Medium/High)
        
        riskOwnerEmail: 'khaled@riscover.com',
        securityAnalystEmail: 'ramy@riscover.com',
        priority: RiskPriority.MEDIUM,
        treatmentStrategy: RiskTreatment.MITIGATE,
        remediationPlanDescription: 'Purchase automated reporting tool.',
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString(),
        tasks: [
          { title: 'Vendor Selection', assignee: 'Mike Ross', status: 'Not Started', dueDate: '2025-12-01' }
        ]
      }
    },
    // 4. Accepted Risk (Compliance)
    {
      creator: 'sarah_it',
      data: {
        title: 'Legacy App MFA Non-Compliance',
        description: 'Old HR system cannot support MFA.',
        category: RiskCategory.COMPLIANCE,
        affectedSystem: 'HR Legacy Portal',
        assetTags: ['HR', 'Legacy'],
        impact: 3, likelihood: 2, // Score 6 (Medium)
        
        riskOwnerEmail: 'mona@riscover.com',
        securityAnalystEmail: 'ramy@riscover.com',
        priority: RiskPriority.MEDIUM,
        treatmentStrategy: RiskTreatment.ACCEPT, // ACCEPTED
        remediationPlanDescription: 'Risk accepted as system retires in Q4.',
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
        tasks: []
      }
    },
    // 5. Low Risk (Avoid)
    {
      creator: 'mike_fin',
      data: {
        title: 'Minor Travel Budget Variance',
        description: 'Potential 5% overspend on travel.',
        category: RiskCategory.FINANCIAL,
        affectedSystem: 'Budgeting',
        assetTags: ['Travel'],
        impact: 2, likelihood: 2, // Score 4 (Low)
        
        riskOwnerEmail: 'khaled@riscover.com',
        securityAnalystEmail: 'ramy@riscover.com',
        priority: RiskPriority.LOW,
        treatmentStrategy: RiskTreatment.AVOID,
        remediationPlanDescription: 'Cancel non-essential travel.',
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        tasks: []
      }
    },
    // 6. Data Privacy Risk (GDPR)
    {
      creator: 'sarah_it',
      data: {
        title: 'Customer Data Retention Breach',
        description: 'Data kept longer than 5 years without justification.',
        category: RiskCategory.COMPLIANCE,
        affectedSystem: 'CRM',
        assetTags: ['Customer Data', 'GDPR'],
        impact: 5, likelihood: 2, // Score 10 (Medium)
        
        riskOwnerEmail: 'mona@riscover.com',
        securityAnalystEmail: 'ramy@riscover.com',
        priority: RiskPriority.HIGH,
        treatmentStrategy: RiskTreatment.MITIGATE,
        remediationPlanDescription: 'Run deletion scripts.',
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString(),
        tasks: []
      }
    }
  ];

  for (const scenario of scenarios) {
    const creatorUser = usersMap[scenario.creator];
    if (creatorUser) {
      try {
        const mockUser = { 
            userId: creatorUser._id, 
            department: creatorUser.department, 
            email: creatorUser.email 
        };
        
        const r = await risksService.create(scenario.data as any, mockUser);
        
        // Handle ACCEPTED Risks (Auto-approve by Admin)
        if (scenario.data.treatmentStrategy === RiskTreatment.ACCEPT) {
             await risksService.updateStatus((r as any)._id.toString(), { 
                 status: RiskStatus.ACCEPTED, 
                 justification: 'Approved via Seed Script' 
             }, { userId: usersMap['admin']._id, role: UserRole.ADMIN });
             console.log(`✅ Risk Created & ACCEPTED: ${r.siNo}`);
        } else {
             console.log(`✅ Risk Created: ${r.siNo} (${r.priority})`);
        }

      } catch (e) { console.log(`Error creating risk: ${e.message}`); }
    }
  }

  console.log('\n🌳 ULTIMATE Seeding Complete!');
  await app.close();
}

bootstrap();