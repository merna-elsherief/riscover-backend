export enum RiskCategory {
  STRATEGIC = 'Strategic',
  OPERATIONAL = 'Operational',
  FINANCIAL = 'Financial',
  COMPLIANCE = 'Compliance',
  CYBERSECURITY = 'Cybersecurity'
}

export enum RiskStrategy {
  ACCEPT = 'Accept',     // قبول الخطر (مش هنعمل حاجة)
  MITIGATE = 'Mitigate', // تخفيف (هنركب Controls)
  TRANSFER = 'Transfer', // نقل (تأمين أو Outsource)
  AVOID = 'Avoid'        // تجنب (نلغي المشروع خالص)
}

export enum RiskStatus {
  DRAFT = 'Draft',
  OPEN = 'Open',
  TREATED = 'Treated',   // تم التعامل معه
  CLOSED = 'Closed'
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}