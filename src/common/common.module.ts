import { Module, Global } from '@nestjs/common'; // ضيفي Global
import { MongooseModule } from '@nestjs/mongoose';
import { CommonService } from './common.service';
import { Counter, CounterSchema } from './counter.schema';

@Global() // خليناه جلوبال عشان نستخدمه في أي مكان من غير ما نعمل Import كل مرة
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }]),
  ],
  providers: [CommonService],
  exports: [CommonService], // بنصدر السيرفيس عشان الناس تستخدمها
})
export class CommonModule {}