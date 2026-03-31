import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 1. 로그인 (JWT 발급)
   * IDP 인증에 성공한 유저 정보를 받아 우리 서버 전용 JWT를 만듦.*
   */
  async login(user: any) {
    // sub를 기준으로 페이로드를 만듦.
    const payload = { 
      sub: user.sub, 
      name: user.name,
      email: user.email 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * 2. 유저 정보 조회 (Strategy나 Guard에서 사용)
   * Repository의 바뀐 이름(findUserBySub)에 맞춰 호출.
   */
  async validateUserBySub(sub: string): Promise<any> {
    const user = await this.authRepository.findUserBySub(sub);
    if (!user) return null;

    // 이제 password 필드가 없으므로 구조 분해 할당 에러가 나지 않습니다.
    return user;
  }

  // 회원가입 필요없음: idp 로그인과 동시에 유저가 자동으로 생성
  // 왜냐하면 InfoteamStrategy에서 upsert를 통해 
  // 로그인과 동시에 유저를 자동으로 생성(회원가입)해주기 때문.
}
