import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { Asset, AssetSchema } from './entities/asset.entity';
import { CommonModule } from '../common/common.module'; // عشان نستخدم CommonService

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
    CommonModule
  ],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}