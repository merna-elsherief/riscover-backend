import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RiskStatus } from '../enums/risk-status.enum'; // تأكدي من المسار

export class FilterRiskDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ enum: RiskStatus, required: false })
  @IsOptional()
  @IsEnum(RiskStatus)
  status?: RiskStatus;

  // ممكن تزودي فلاتر تانية زي ownerEmail لو تحبي
}