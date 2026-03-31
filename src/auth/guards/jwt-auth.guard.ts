// src/auth/guards/jwt-auth.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// JwtStrategy를 사용하여 인증 수행. 'jwt'는 Strategy에 정의된 이름
@Injectable()
export class JwtAuthGuard extends AuthGuard('infoteam') {}