import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity'; // تأكدي إن المسار صح

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail() // لازم يكون إيميل حقيقي
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(3, { message: 'Password is too short' }) // أقل حاجة 3 حروف
  password: string;

  // هنا بنستخدم الـ Enum اللي عملناه عشان نتأكد إن الدور صح
  @IsEnum(UserRole) 
  role: string;

  @IsString()
  @IsNotEmpty()
  department: string;
} 