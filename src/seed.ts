import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  // 1. بنشغل التطبيق في وضع "Application Context"
  // ده معناه: حمل الداتابيز والسيرفيسز، بس ماتفتحش بورت 3000 ولا تشغل سيرفر
  const app = await NestFactory.createApplicationContext(AppModule);

  // 2. بنجيب نسخة من UsersService عشان نستخدمها
  const usersService = app.get(UsersService);

  // 3. الداتا اللي عايزين نزرعها
  const usersToCreate = [
    {
      firstName: 'Admin', lastName: 'System', username: 'admin',
      email: 'admin@riscover.com', password: '123',
      role: 'Admin', department: 'Management'
    },
    {
      firstName: 'Hassan', lastName: 'Manager', username: 'hassan_head',
      email: 'hassan@riscover.com', password: '123',
      role: 'BU Head', department: 'IT'
    },
    {
      firstName: 'Mona', lastName: 'HR', username: 'mona_hr',
      email: 'mona@riscover.com', password: '123',
      role: 'BU Head', department: 'HR'
    },
    {
      firstName: 'Ali', lastName: 'Owner', username: 'ali_owner',
      email: 'ali@riscover.com', password: '123',
      role: 'Risk Owner', department: 'IT'
    }
  ];

  console.log('🌱 Seeding started...');

  for (const user of usersToCreate) {
    try {
      // بنستخدم نفس دالة Create اللي كتبناها عشان تشفر الباسورد وتعمل check
      await usersService.create(user as any);
      console.log(`✅ Created user: ${user.username}`);
    } catch (error) {
      console.log(`⚠️ Skipped: ${user.username} (Already exists)`);
    }
  }

  console.log('🌳 Seeding complete!');

  // 4. أهم خطوة: نقفل الاتصال عشان السكربت ينتهي
  await app.close();
}

bootstrap();