// src/auth/auth.controller.ts

import { Body, Controller, Post, UsePipes, ValidationPipe, Request, HttpCode } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

// Passport Local Guard import
import { LocalAuthGuard } from './guards/local-auth.guard'; 
import { UseGuards } from '@nestjs/common';

@Controller('auth')
@ApiTags('auth')
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register - 회원가입 API
  @Post('register')
  @ApiResponse({ status: 201, description: '회원가입 성공', type: Object })
  @ApiResponse({ status: 409, description: '이미 존재하는 사용자 ID' })
  async register(@Body() authDto: AuthDto) {
    return await this.authService.register(authDto);
  }

  // POST /auth/login - 로그인 API (Basic 인증)
  // HTTP 상태 코드 = 200 OK
  @HttpCode(200) 
  @Post('login')
  @UseGuards(LocalAuthGuard) // LocalAuthGuard를 사용하여 사용자 인증 (Passport 권장 조건)
  @ApiBody({ type: AuthDto, description: '로그인에 필요한 사용자 ID와 비밀번호' }) // Swagger Body 명시
  @ApiResponse({ status: 200, description: '로그인 성공 및 JWT 토큰 발급' })
  async login(@Request() req: any) {
    // Passport LocalStrategy를 통과하면 req.user에 사용자 정보가 담깁니다.
    // 이 정보를 사용하여 JWT 토큰을 발급하는 로직을 AuthService에서 처리합니다.
    return this.authService.login(req.user);
  }
}
