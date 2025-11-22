import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthRepository } from './auth.repository/auth.repository';
import { PrismaModule } from '../prisma/prisma.module'; 
import { PassportModule } from '@nestjs/passport'; 
import { JwtModule } from '@nestjs/jwt'; 
import { LocalStrategy } from './auth/strategies/local.strategy'; 
import { JwtStrategy } from './auth/strategies/jwt.strategy'; // JwtStrategy import (다음 단계에서 구현)

@Module({
  imports: [
    
    // 중요* Passport 설정: JWT를 기본 인증 전략으로 지정
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    
    // JWT 설정: 토큰 서명에 필요한 비밀키와 만료 시간을 설정
    JwtModule.register({
      secret: 'MY_JWT_SECRET_KEY', 
      signOptions: { expiresIn: '60m' }, // 토큰 만료 시간: 60분
    }),
  ],
  controllers: [AuthController],
  // Strategy와 Guard는 모두 Provider로 등록해야 합니다.
  providers: [
    AuthService, 
    AuthRepository, 
    LocalStrategy,
    JwtStrategy  
  ],
  // PostsModule 등 다른 모듈에서 JWT 인증된 사용자 정보를 사용하기 위해 export.
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}

//prismaModule (@Global()을 사용했으므로 imports에서 제거함.)