import { IsEnum, IsString, IsNotEmpty, ValidateIf } from 'class-validator';
import { RiskStatus } from '../enums/risk-status.enum'; // استيراد

export class UpdateRiskStatusDto {
  @IsEnum(RiskStatus, {
    message: `status must be one of: ${Object.values(RiskStatus).join(', ')}`
  })
  status: RiskStatus;

  // شرط الـ Accepted
  @ValidateIf(o => o.status === RiskStatus.ACCEPTED)
  @IsString()
  @IsNotEmpty()
  justification?: string;
}