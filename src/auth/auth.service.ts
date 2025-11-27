import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    // 1. ندور على اليوزر
    const user = await this.usersService.findByEmail(email);
    
    // 2. لو مفيش يوزر، أو الباسورد غلط
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. لو كله تمام، نجهز بيانات التذكرة (Payload)
    const payload = { 
      sub: user['_id'], // بنحط الـ ID
      email: user.email, 
      role: user.role,
      department: user.department
    };

    // 4. نرجع التذكرة الموقعة
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}