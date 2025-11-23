import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateRiskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  @Max(5) // مستحيل يقبل رقم أكبر من 5
  likelihood: number;

  @IsInt()
  @Min(1)
  @Max(5)
  impact: number;
}