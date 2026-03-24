import { Controller, Get, Post, UseGuards, Request, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express'; // express에서 직접 import

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 1. IDP 로그인 확인 (과제의 "로그인" 기능)
   * Postman에서 Bearer 토큰을 헤더에 담아 호출하면 
   * Strategy가 IDP에 물어보고 우리 DB에 유저를 저장한 뒤 정보를 반환합니다.
   */
  @ApiOperation({ summary: 'IDP 로그인 상태 확인 및 유저 저장' })
  @ApiResponse({ status: 200, description: '로그인 성공 및 DB 저장 완료' })
  @Get('profile')
  @UseGuards(AuthGuard('infoteam')) // 우리가 만든 'infoteam' 전략 사용
  async getProfile(@Request() req: any) {
    // Strategy의 validate()가 반환한 유저 정보가 req.user에 들어있습니다.
    return {
      message: 'IDP 인증 및 유저 정보 저장 성공',
      user: req.user,
    };
  }

  /**
   * 2. 로그아웃 (과제 조건)
   * 토큰 인증 방식은 서버에 세션이 없으므로, 클라이언트가 토큰을 삭제하면 됩니다.
   * 과제 요건을 위해 로그아웃 성공 메시지만 반환합니다.
   */
  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { 
      message: '성공적으로 로그아웃 되었습니다. (브라우저/Postman의 토큰을 제거하세요)' 
    };
  }
}
  


