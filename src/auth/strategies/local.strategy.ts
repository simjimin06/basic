
/*
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import * as bcrypt from 'bcryptjs';

// LocalStrategy: ID/PW 인증 방식 구현
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local'){
  constructor(private authService: AuthService) {
    super({
      usernameField: 'userId', // 사용자 ID 이름을 userId로 지정
      passwordField: 'password', // 비밀번호 이름을 password로 지정
    });
  }

  // Passport가 제공하는 validate 함수 (ID/PW를 받아 인증 로직 실행)
  async validate(userId: string, password: string): Promise<any> {

    // 1. AuthService를 통해 사용자 ID로 DB에서 사용자 정보를 가져옴.
    const user = await this.authService.validateUser(userId, password);
    
    // If 인증 실패, (user가 null 또는 false) 401 Unauthorized 예외를 던짐.
    if (!user) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
    
    // If 인증 성공, *비밀번호를 제외한* 사용자 정보를 반환
    return user; 
 } 
}
 */