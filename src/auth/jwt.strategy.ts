import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  // ضفنا علامة التعجب في الآخر 👇
  secretOrKey: configService.get<string>('JWT_SECRET')!,
});
  }

  // لو التذكرة سليمة، NestJS هينادي الدالة دي
  async validate(payload: any) {
    // الـ payload ده هو البيانات اللي حطيناها جوه التذكرة (id, email, role)
    // اللي هترجعيه هنا، NestJS هيحطهولك في الـ Request object تلقائياً
    return { userId: payload.sub, email: payload.email, role: payload.role, department: payload.department };
  }
}