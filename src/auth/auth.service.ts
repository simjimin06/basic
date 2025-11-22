import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'; // bcryptjs import
import { AuthRepository } from '../auth.repository/auth.repository';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  // [C] 회원가입 로직
  async register(authDto: AuthDto) {
    // 1. 이미 존재하는 사용자인지 Repository를 통해 확인
    const existingUser = await this.authRepository.findUserById(authDto.userId);
    if (existingUser) {
      // NestJS의 기본 예외를 사용하여 HTTP 409 Conflict 응답을 보냄.
      throw new ConflictException('이미 존재하는 사용자 ID입니다.');
    }

    // 2. 비밀번호 암호화 (Salt round: 10)
    const hashedPassword = await bcrypt.hash(authDto.password, 10);

    // 3. 사용자 생성 및 저장 (Repository에 위임)
    const newUser = await this.authRepository.createUser({
      userId: authDto.userId,
      name: authDto.userId, // 이름은 임시로 userId와 동일하게 설정
      password: hashedPassword,
    });

    // 4. 비밀번호를 제외한 사용자 정보 반환
    // JavaScript의 구조 분해 할당을 이용해 password 필드를 분리
    const { password, ...result } = newUser;
    return result;
  }
  
  // 향후 JWT 로그인 로직이 여기에 추가됩니다.
  // Validate user credentials used by LocalStrategy
  async validateUser(userId: string, password: string): Promise<any> {
    const user = await this.authRepository.findUserById(userId);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { password: _pw, ...result } = user;
    return result;
  }

  // Create JWT for authenticated user
  async login(user: any) {
    const payload = { userId: user.userId, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
