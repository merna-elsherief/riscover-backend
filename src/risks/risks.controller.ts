import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UsePipes, ValidationPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RisksService } from './risks.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';
import { UpdateRiskStatusDto } from './dto/update-risk-status.dto';

@ApiTags('risks')
@Controller('risks')
export class RisksController {
  constructor(private readonly risksService: RisksService) {}

  // 1️⃣ Create Risk
  @Post()
  @ApiOperation({ summary: 'Create a new risk with tasks & scores' })
  @ApiResponse({ status: 201, description: 'The risk has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Validation Error (Check tasks or scores)' })
  // مهم جداً: تفعيل الـ whitelist عشان يمنع أي داتا زيادة، و transform عشان يحول الـ JSON لـ Class
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true })) 
  create(@Body() createRiskDto: CreateRiskDto) {
    return this.risksService.create(createRiskDto);
  }

  // 2️⃣ Get All Risks
  @Get()
  @ApiOperation({ summary: 'Get all risks' })
  findAll() {
    return this.risksService.findAll();
  }

  // 3️⃣ Get Next ID (Action)
  // ⚠️ لازم تفضل قبل الـ :id عشان الراوت ميتلخبطش
  @Get('next-id')
  @ApiOperation({ summary: 'Get the next auto-generated ID (e.g. R-2025-004)' })
  getNextId() {
    return this.risksService.getNextIdForDisplay();
  }

  // 4️⃣ Get One Risk
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific risk by MongoDB ID' })
  findOne(@Param('id') id: string) {
    return this.risksService.findOne(id);
  }

  // 5️⃣ Update Risk
  @Patch(':id')
  @ApiOperation({ summary: 'Update a risk (Supports updating tasks & residual scores)' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('id') id: string, @Body() updateRiskDto: UpdateRiskDto) {
    return this.risksService.update(id, updateRiskDto);
  }

  @Patch(':id/status') // الشكل هيكون: /risks/R-2025-001/status
@ApiOperation({ summary: 'Update risk status only' })
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
updateStatus(
  @Param('id') id: string, 
  @Body() updateRiskStatusDto: UpdateRiskStatusDto
) {
  return this.risksService.updateStatus(id, updateRiskStatusDto.status);
}

  // 6️⃣ Delete Risk
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a risk' })
  remove(@Param('id') id: string) {
    return this.risksService.remove(id);
  }
}