// src/auth/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from '../passport-jwt';
import { AuthRepository } from '../auth.repository/auth.repository';

type JwtPayload = { userId: string, sub: number };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authRepository: AuthRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: false,
      secretOrKey: 'MY_JWT_SECRET_KEY', 
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const user = await this.authRepository.findUserById(payload.userId);

    if (!user) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
    const { password, ...result } = user;
    return result; 
  }
}