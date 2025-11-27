import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // استيراد
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // 1. استيراد

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // تفعيل الفلترة والتحقق
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // أي حقل زيادة مش موجود في DTO هيتحذف (أمان)
    forbidNonWhitelisted: true, // لو بعت حقل زيادة يرجع Error
  }));

  // ===========================================
  // 2. إعدادات Swagger (هنا السحر كله) ✨
  // ===========================================
  const config = new DocumentBuilder()
    .setTitle('Riscover API') // اسم المشروع
    .setDescription('The Riscover GRC Solution API description') // وصف
    .setVersion('1.0') // الإصدار
    .addBearerAuth() // ⚠️ مهم جداً: عشان زرار القفل يظهر ونقدر نحط التوكن
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // الرابط اللي هتفتح عليه الصفحة (http://localhost:3000/api)
  SwaggerModule.setup('api', app, document);
  // ===========================================
  app.enableCors({
    origin: 'http://localhost:5173', // السماح للـ frontend
    credentials: true,               // لو عايزة ترسل cookies أو توكن
  });

  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
