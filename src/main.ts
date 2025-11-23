import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // استيراد

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // تفعيل الفلترة والتحقق
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // أي حقل زيادة مش موجود في DTO هيتحذف (أمان)
    forbidNonWhitelisted: true, // لو بعت حقل زيادة يرجع Error
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
