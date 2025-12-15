import { PartialType } from '@nestjs/mapped-types'; // مكتبة بتسهل الحياة
import { CreateRiskDto } from './create-risk.dto';

// الكلاس ده بياخد كل خصائص CreateRiskDto ويخليها Optional أوتوماتيك
export class UpdateRiskDto extends PartialType(CreateRiskDto) {}