import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { AssetsService } from './assets/assets.service';
import { GovernanceService } from './governance/governance.service';
import { ControlsService } from './controls/controls.service';
import { ComplianceService } from './compliance/compliance.service';
import { RisksService } from './risks/risks.service';
import { UserRole } from './users/entities/user.entity';
import { DocumentType } from './governance/enums/document-type.enum';
import { DocumentStatus } from './governance/enums/document-status.enum'; // تأكدي إن ده الجديد
import { Priority } from './governance/enums/priority.enum'; // 🆕 استيراد جديد
import { ControlStatus } from './controls/enums/control-status.enum';
import { RiskCategory, RiskStrategy } from './risks/enums/risk-enums';
import { AssetType } from './assets/enums/asset-type.enum';
import { AssetStatus } from './assets/enums/asset-status.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const assetsService = app.get(AssetsService);
  const govService = app.get(GovernanceService);
  const controlsService = app.get(ControlsService);
  const complianceService = app.get(ComplianceService);
  const risksService = app.get(RisksService);

  console.log('🌱 Starting Seeding Process...');

  try {
    // 1. Users
    console.log('👤 Seeding Users...');
    const admin: any = await usersService.create({
      username: 'admin', firstName: 'System', lastName: 'Admin',
      email: 'admin@riscover.com', password: 'Password123!',
      role: UserRole.ADMIN, jobTitle: 'Super Admin'
    } as any);

    const ciso: any = await usersService.create({
      username: 'ciso_user', firstName: 'Hassan', lastName: 'Ali',
      email: 'ciso@riscover.com', password: 'Password123!',
      role: UserRole.BU_HEAD, jobTitle: 'CISO'
    } as any);

    const riskOfficer: any = await usersService.create({
      username: 'risk_officer', firstName: 'Mona', lastName: 'Zaki',
      email: 'risk@riscover.com', password: 'Password123!',
      role: UserRole.COMPLIANCE_MANAGER, jobTitle: 'Risk Officer'
    } as any);
    console.log('✅ Users Created.');

    // 2. Frameworks
    console.log('📘 Seeding Frameworks...');
    const isoFramework: any = await complianceService.create({
      name: 'ISO 27001', description: 'Information Security Management',
      type: 'Security', version: '2022'
    });
    console.log('✅ ISO 27001 Created.');

    // 3. Governance (Policies) - 🆕 التحديث هنا
    console.log('📜 Seeding Policies...');
    const accessPolicy: any = await govService.create({
      code: 'ISP-09',
      title: 'Access Control Policy',
      description: 'Policy regarding user access rights',
      type: DocumentType.POLICY,
      
      // Ownership & Assignment
      owner: ciso._id.toString(),
      assignee: riskOfficer._id.toString(), // 🆕 Risk Officer هو اللي شغال عليها
      participants: [admin._id.toString()], // 🆕
      
      // Status & Progress
      status: DocumentStatus.OPEN, // 🆕 الحالة الجديدة
      priority: Priority.HIGH,     // 🆕 الأولوية
      progress: 45,                // 🆕 البروجرس بار
      
      // Dates
      nextReviewDate: '2025-12-31',
      dueDate: '2024-06-30',
      
      fileUrl: 'http://localhost:3000/uploads/dummy-policy.pdf',
    } as any);
    console.log('✅ Policies Created with new fields.');

    // 4. Controls
    console.log('🛡️ Seeding Controls...');
    const firewallControl: any = await controlsService.create({
      code: 'A.13.1', name: 'Network Security Management',
      framework: isoFramework.name,
      status: ControlStatus.IMPLEMENTED,
      linkedPolicies: [accessPolicy._id.toString()]
    } as any);

    const backupControl: any = await controlsService.create({
      code: 'A.12.3', name: 'Backup',
      framework: isoFramework.name,
      status: ControlStatus.IN_PROGRESS,
      linkedPolicies: [accessPolicy._id.toString()]
    } as any);
    console.log('✅ Controls Created.');

    // 5. Assets
    console.log('💻 Seeding Assets...');
    const dbServer: any = await assetsService.create({
      name: 'Main Database Server',
      type: AssetType.HARDWARE, category: 'Servers',
      operatingSystem: 'Windows Server 2022', manufacturer: 'Dell',
      versionModel: 'PowerEdge R750', serialNumber: 'SN-99887766',
      businessCriticality: 5,
      owner: ciso._id.toString(),
      status: AssetStatus.ACTIVE
    } as any);
    console.log(`✅ Asset Created.`);

    // 6. Risks
    console.log('🔥 Seeding Risks...');
    const risk1: any = await risksService.create({
      title: 'Database Data Loss',
      description: 'Risk of losing customer data',
      category: RiskCategory.OPERATIONAL,
      owner: riskOfficer._id.toString(),
      affectedAssets: [dbServer._id.toString()],
      inherentLikelihood: 4, inherentImpact: 5, 
      treatmentStrategy: RiskStrategy.MITIGATE,
      mitigatingControls: [backupControl._id.toString()], 
      residualLikelihood: 2, residualImpact: 2 
    } as any);
    console.log(`✅ Risk Created.`);

  } catch (error) {
    console.error('❌ Seeding Failed:', error);
  } finally {
    await app.close();
  }
}
bootstrap();