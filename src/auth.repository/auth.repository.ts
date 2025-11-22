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
}
