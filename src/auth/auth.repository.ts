import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type User = {
  id: number;
  userId: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class AuthRepository {

    constructor(private readonly prisma: PrismaService) {}

  // 사용자 ID로 사용자 조회 (로그인 시 사용)
  async findUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { userId: userId },
    }) as Promise<User | null>;
  }

  // 사용자 생성 (회원가입 시 사용)
  async createUser(data: { userId: string, name: string, password: string }): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: data,
    });
    return newUser as User;
  }

  async findUserByJwtPayload(userId: string): Promise<any> {
  // AuthRepository의 findUserById 메서드를 호출합니다.
    const user = await this.findUserById(userId);
    if (!user) {
      return null;
  }
  // 비밀번호만 제외하고 나머지 정보(id, userId, name 등)를 반환합니다.
    const { password, ...result } = user;
    return result;
}
  
}
