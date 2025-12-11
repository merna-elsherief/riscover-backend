import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GovernanceService } from './governance.service';
import { CreateGovernanceDocumentDto } from './dto/create-governance-document.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DocumentType } from './enums/document-type.enum';

@ApiTags('Governance')
@Controller('governance')
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create new Policy/Standard' })
  create(@Body() createDto: CreateGovernanceDocumentDto) {
    return this.governanceService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List documents (Filter by Type for Sidebar)' })
  @ApiQuery({ name: 'type', enum: DocumentType, required: false })
  findAll(@Query('type') type?: DocumentType) {
    return this.governanceService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.governanceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.governanceService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.governanceService.remove(id);
  }
}