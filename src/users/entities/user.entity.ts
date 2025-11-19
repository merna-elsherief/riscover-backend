import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  ADMIN = 'Admin',
  BU_HEAD = 'BU Head',
  COMPLIANCE_MANAGER = 'Compliance Manager',
  SECURITY_ANALYST = 'Security Analyst',
  RISK_OWNER = 'Risk Owner',
  TECHNICAL_OWNER = 'Technical Owner',
  AUDITOR = 'Auditor'
}

@Schema({ timestamps: true })
export class User {
  // 1. تقسيم الاسم
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  // 2. إضافة الـ Username (لازم يكون فريد زي الإيميل)
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true }) 
  password: string;

  // 3. خانة الـ Provider للـ SSO
  @Prop({ default: 'local' }) // local = ايميل وباسورد، google = جاي من جوجل
  provider: string;

  @Prop({ 
    required: true, 
    enum: UserRole,
    default: UserRole.RISK_OWNER 
  })
  role: string;

  @Prop({ required: true })
  department: string;

  @Prop({ type: Object, default: {} }) 
  dashboardPreferences: Record<string, any>; 
  
  // Virtual Property: عشان لو حبيتي تنادي user.fullName ترجعلك الاسم كامل
  // دي مش بتتحفظ في الداتابيز، دي بتتحسب وقت الطلب
}

const UserSchema = SchemaFactory.createForClass(User);

// تفعيل الـ Virtuals عشان تظهر في الـ JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

export { UserSchema };