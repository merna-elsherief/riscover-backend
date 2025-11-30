import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ControlsService } from './controls/controls.service';
import { RisksService } from './risks/risks.service';

// Enums
import { UserRole } from './users/entities/user.entity';
import { ControlType } from './controls/enums/control-type.enum';
import { RiskCategory } from './risks/enums/risk-category.enum';
import { RiskPriority } from './risks/enums/risk-priority.enum';
import { RiskTreatment } from './risks/enums/risk-treatment.enum';
import { RiskStatus } from './risks/enums/risk-status.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const controlsService = app.get(ControlsService);
  const risksService = app.get(RisksService);

  console.log('🚀 Starting "Mega" Seeding...\n');

  // ==========================================
  // 1. Users (Team Roster)
  // ==========================================
  console.log('👤 Creating Team Members...');
  
  const usersData = [
    // --- Management ---
    { firstName: 'Admin', lastName: 'System', username: 'admin', email: 'admin@riscover.com', role: UserRole.ADMIN, department: 'Board' },
    
    // --- Business Unit Heads ---
    { firstName: 'Hassan', lastName: 'El-Sayed', username: 'head_it', email: 'hassan@riscover.com', role: UserRole.BU_HEAD, department: 'IT' },
    { firstName: 'Mona', lastName: 'Zaki', username: 'head_hr', email: 'mona@riscover.com', role: UserRole.BU_HEAD, department: 'HR' },
    { firstName: 'Khaled', lastName: 'Salem', username: 'head_fin', email: 'khaled@riscover.com', role: UserRole.BU_HEAD, department: 'Finance' },

    // --- Risk Owners ---
    { firstName: 'Sarah', lastName: 'Johnson', username: 'sarah_it', email: 'sarah@riscover.com', role: UserRole.RISK_OWNER, department: 'IT' },
    { firstName: 'Mike', lastName: 'Ross', username: 'mike_fin', email: 'mike@riscover.com', role: UserRole.RISK_OWNER, department: 'Finance' },
    
    // --- Security Analysts ---
    { firstName: 'Ramy', lastName: 'Adel', username: 'ramy_sec', email: 'ramy@riscover.com', role: UserRole.SECURITY_ANALYST, department: 'Cybersecurity' }
  ];

  const usersMap: any = {};
  
  for (const u of usersData) {
    try {
      let user: any = await usersService.findByUsername(u.username);
      if (!user) {
        // Default password for everyone
        user = await usersService.create({ ...u, password: '123' } as any);
        console.log(`✅ User: ${u.username} (${u.role})`);
      }
      usersMap[u.username] = user;
    } catch (e) { console.log(`⚠️ User Skip: ${u.username}`); }
  }

  // ==========================================
  // 2. Controls Library (ISO & NIST)
  // ==========================================
  console.log('\n🛡️ Populating Controls Library...');

  const controls = [
    { code: 'AC-3', name: 'Access Enforcement', type: ControlType.PREVENTIVE, description: 'Enforce approved authorizations for logical access.' },
    { code: 'AU-2', name: 'Audit Events', type: ControlType.DETECTIVE, description: 'Determine that the information system is capable of auditing events.' },
    { code: 'IR-4', name: 'Incident Handling', type: ControlType.CORRECTIVE, description: 'Implement an incident handling capability.' },
    { code: 'ISO-A.12.3', name: 'Backup', type: ControlType.CORRECTIVE, description: 'Backup copies of information, software and system images.' },
    { code: 'ISO-A.9.2', name: 'User Access Provisioning', type: ControlType.PREVENTIVE, description: 'Formal user registration and de-registration process.' },
    { code: 'PCI-DSS-1', name: 'Firewall Config', type: ControlType.PREVENTIVE, description: 'Install and maintain a firewall configuration.' }
  ];

  for (const c of controls) {
    try { await controlsService.create(c as any); console.log(`✅ Control: ${c.code}`); } 
    catch (e) {}
  }

  // ==========================================
  // 3. Risks Scenarios (Diverse Data)
  // ==========================================
  console.log('\n🔥 Generating Risk Scenarios...');

  const scenarios = [
    // ----------------------------------------------------
    // Scenario 1: Critical Security Risk (Ransomware)
    // ----------------------------------------------------
    {
      creator: 'sarah_it',
      data: {
        title: 'Ransomware Attack Susceptibility',
        description: 'Outdated server patches increasing vulnerability to ransomware attacks.',
        category: RiskCategory.SECURITY,
        affectedSystem: 'Core ERP & File Servers',
        assetTags: ['Servers', 'Windows 2016', 'Data Center'],
        impact: 5, likelihood: 5, // Score 25 (Critical)
        
        riskOwnerEmail: 'hassan@riscover.com',
        securityAnalystEmail: 'ramy@riscover.com',
        
        priority: RiskPriority.CRITICAL,
        treatmentStrategy: RiskTreatment.MITIGATE,
        remediationPlanDescription: 'Immediate patching of all servers and enable immutable backups.',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
        
        tasks: [
          { title: 'Patch Windows Servers', assignee: 'IT Admin', status: 'In Progress', dueDate: '2025-10-01' },
          { title: 'Configure Immutable Backups', assignee: 'Backup Team', status: 'Not Started', dueDate: '2025-10-05' }
        ]
      }
    },
    // ----------------------------------------------------
    // Scenario 2: High Operational Risk (Cloud Outage)
    // ----------------------------------------------------
    {
      creator: 'sarah_it',
      data: {
        title: 'Single Zone Cloud Failure',
        description: 'Application is hosted in a single AWS availability zone.',
        category: RiskCategory.OPERATIONAL,
        affectedSystem: 'Customer Portal',
        assetTags: ['AWS', 'Cloud', 'Hosting'],
        impact: 5, likelihood: 3, // Score 15 (High)
        
        riskOwnerEmail: 'hassan@riscover.com',
        securityAnalystEmail: 'ramy@riscover.com',
        
        priority: RiskPriority.HIGH,
        treatmentStrategy: RiskTreatment.MITIGATE,
        remediationPlanDescription: 'Architect Multi-AZ deployment.',
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString(),
        tasks: []
      }
    },
    // ----------------------------------------------------
    // Scenario 3: Medium Financial Risk (Reporting)
    // ----------------------------------------------------
    {
      creator: 'mike_fin',
      data: {
        title: 'Financial Reporting Errors',
        description: 'Manual entry in spreadsheets causes quarterly errors.',
        category: RiskCategory.FINANCIAL,
        affectedSystem: 'Excel Sheets',
        assetTags: ['Finance', 'Reporting'],
        impact: 4, likelihood: 3, // Score 12 (High/Medium)
        
        riskOwnerEmail: 'khaled@riscover.com',
        securityAnalystEmail: 'ramy@riscover.com',
        
        priority: RiskPriority.MEDIUM,
        treatmentStrategy: RiskTreatment.MITIGATE,
        remediationPlanDescription: 'Implement automated GL software.',
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
        
        tasks: [
          { title: 'Select Vendor', assignee: 'Mike Ross', status: 'Completed', dueDate: '2025-01-01' },
          { title: 'Data Migration', assignee: 'IT Team', status: 'In Progress', dueDate: '2025-03-01' }
        ]
      }
    },
    // ----------------------------------------------------
    // Scenario 4: Compliance Risk (Accepted)
    // ----------------------------------------------------
    {
      creator: 'sarah_it',
      data: {
        title: 'Legacy App Non-Compliance',
        description: 'Old HR system does not support MFA (Multi-Factor Auth).',
        category: RiskCategory.COMPLIANCE,
        affectedSystem: 'Legacy HR Portal',
        assetTags: ['Legacy', 'HR'],
        impact: 3, likelihood: 2, // Score 6 (Medium)
        
        riskOwnerEmail: 'mona@riscover.com',
        securityAnalystEmail: 'ramy@riscover.com',
        
        priority: RiskPriority.MEDIUM,
        treatmentStrategy: RiskTreatment.ACCEPT, // Accepted Risk
        remediationPlanDescription: 'Risk accepted due to system retirement in 6 months.',
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
        tasks: []
      }
    },
     // ----------------------------------------------------
    // Scenario 5: Low Risk (Draft)
    // ----------------------------------------------------
    {
      creator: 'mike_fin',
      data: {
        title: 'Minor Budget Variance',
        description: 'Travel expenses exceeding budget by 5%.',
        category: RiskCategory.FINANCIAL,
        affectedSystem: 'Budgeting',
        assetTags: ['Expenses'],
        impact: 2, likelihood: 2, // Score 4 (Low)
        
        riskOwnerEmail: 'khaled@riscover.com',
        securityAnalystEmail: 'ramy@riscover.com',
        
        priority: RiskPriority.LOW,
        treatmentStrategy: RiskTreatment.AVOID,
        remediationPlanDescription: 'Update travel policy.',
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
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
        
        // *Bonus Logic*: لو الخطر Accepted في الداتا، نغير حالته في الداتابيز عشان يظهر في الداشبورد صح
        if (scenario.data.treatmentStrategy === RiskTreatment.ACCEPT) {
            // محاكاة موافقة المدير
             await risksService.updateStatus((r as any)._id.toString(), { 
                 status: RiskStatus.ACCEPTED, 
                 justification: 'Approved via Seed Script' 
             }, { userId: usersMap['admin']._id, role: UserRole.ADMIN }); // Admin approves for seed
             console.log(`✅ Risk Created & ACCEPTED: ${r.siNo}`);
        } else {
             console.log(`✅ Risk Created: ${r.siNo} - ${r.title} (${r.priority})`);
        }

      } catch (e) { console.log(`Error creating risk: ${e.message}`); }
    }
  }

  console.log('\n🌳 Mega Seeding Complete! Dashboard is ready.');
  await app.close();
}

bootstrap();