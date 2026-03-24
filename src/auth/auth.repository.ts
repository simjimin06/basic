import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type User = {
  id: string; // uuid
  sub: string;
  name: string;
  email: string;
  createdAt: Date;
};

@Injectable()
export class AuthRepository {

    constructor(private readonly prisma: PrismaService) {}

  // 2. sub(IDP 고유값)로 사용자 조회
  async findUserBySub(sub: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { sub: sub },
    }) as Promise<User | null>;
  }

  // 3. 사용자 생성 (IDP 정보를 바탕으로 저장)
  async createUser(data: { sub: string; name: string; email: string }): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        sub: data.sub,
        name: data.name,
        email: data.email,
      },
    });
    return newUser as User;
  }

  // 4. 인증용 사용자 조회 (비밀번호 로직 제거)
  async findUserForAuth(sub: string): Promise<any> {
    const user = await this.findUserBySub(sub);
    if (!user) {
      return null;
    }
    // 이제 password가 없으므로 비밀번호 제외 로직 없이 바로 반환하거나, 
    // 필요한 필드만 골라낼 수 있음!
    return user;
  }
}