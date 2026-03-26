// JwtStrategy에서 토큰 검증 후 req.user에 주입될 사용자 정보의 타입입니다.
// 이는 AuthRepository의 User 타입에서 password만 제외한 형태와 일치해야 합니다.
export interface JwtUserPayload {
  id: string;      // DB Primary Key (Int)
  email: string;  // 로그인 ID (String)
  name: string;
  sub:string;
  createdAt: Date;
  updatedAt: Date;
}

// NestJS에서 사용하는 Express의 Request 객체를 확장하여
// JWT 인증 후 추가된 user 필드를 명시적으로 정의합니다.
import { Request } from 'express';

export interface RequestWithUser extends Request {
  // JwtAuthGuard 통과 후, 이 user 필드에 JwtUserPayload 형태의 객체가 담깁니다.
  user: JwtUserPayload;
}