import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RiskStatus } from './create-risk.dto'; // استيراد الـ Enum الموجود عندك

export class UpdateRiskStatusDto {
  @ApiProperty({ enum: RiskStatus, example: RiskStatus.IN_PROGRESS })
  @IsEnum(RiskStatus)
  @IsNotEmpty()
  status: RiskStatus;
}