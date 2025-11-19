import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

// DTO بسيط عشان البيانات اللي جاية
class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK) // عشان يرجع 200 بدل 201
  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}