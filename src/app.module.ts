import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RiskModule } from './risks/risks.module';
import { ControlsModule } from './controls/controls.module';
import { ComplianceModule } from './compliance/compliance.module';
import { AssetsModule } from './assets/assets.module';
import { GovernanceModule } from './governance/governance.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),

    UsersModule,

    AuthModule,

    CommonModule,

    RiskModule,

    ControlsModule,

    ComplianceModule,

    AssetsModule,

    GovernanceModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}