import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Assets') // عشان يظهر في Swagger
@ApiBearerAuth()   // علامة القفل
@UseGuards(AuthGuard('jwt')) // حماية الموديول كله
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  // ==========================================
  // 1. Helpers & Previews
  // ==========================================

  @Get('next-id') // الرابط: /assets/next-id
  @ApiOperation({ summary: 'Preview next Asset ID (e.g. AST-2025-001)' })
  getNextId() {
    return this.assetsService.getNextId();
  }

  // ==========================================
  // 2. CRUD Operations
  // ==========================================

  @Post()
  @ApiOperation({ summary: 'Create a new Asset' })
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.create(createAssetDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all assets' })
  findAll() {
    return this.assetsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset details by MongoDB ID' })
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id);
  }

  // (اختياري) لو حابة تضيفي تحديث
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
  //   return this.assetsService.update(id, updateAssetDto);
  // }
}