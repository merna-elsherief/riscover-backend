import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 1. استيراد Config
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 2. تحميل ملف .env وتخليته متاح في المشروع كله (Global)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 3. الاتصال بالداتابيز بشكل Async (عشان نضمن إن ملف .env اتقرأ الأول)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), // بيجيب الرابط من الملف
      }),
      inject: [ConfigService],
    }),

    UsersModule,

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}