import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; 
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt'; // 1. JwtModule 추가
import { InfoteamStrategy } from './strategies/infoteam.strategy'; 
import { AuthService } from './auth.service'; 
import { AuthController } from './auth.controller'; 
import { AuthRepository } from './auth.repository'; 
import { PrismaService } from '../../prisma/prisma.service'; 

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    PassportModule.register({ defaultStrategy: 'infoteam' }),
    // 2. JWT 설정 추가 (토큰을 만들 때 쓸 암호와 만료 시간 설정)
    JwtModule.register({
      secret: 'secretKey', // 실제 서비스에선 .env에 넣어야 하지만 일단 테스트용!
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    InfoteamStrategy, 
    PrismaService,
    AuthService,
    AuthRepository,
  ],
  exports: [PassportModule, AuthService, InfoteamStrategy],
})
export class AuthModule {}



