import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; 
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    JwtModule.registerAsync({

      imports: [ConfigModule], // 1. ConfigModule을 사용한다고 명시
      inject: [ConfigService], // 2. ConfigService를 주입받음
      useFactory: async (configService: ConfigService) => ({
        // 3. 실제 값을 꺼낼 때는 '소문자' 매개변수를 사용!
        secret: configService.get<string>('JWT_SECRET'), // .env 파일에서 JWT_SECRET 값을 가져옴
        signOptions: { 
          expiresIn: configService.get<any>('JWT_EXPIRES_IN') || '1h' 
        },
      }),
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



