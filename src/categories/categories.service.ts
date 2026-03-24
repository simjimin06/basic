import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. 모든 카테고리 목록 조회
  async findAll() {
    return this.prisma.category.findMany();
  }

  // 2. 카테고리 추가
  async create(name: string) {
    return this.prisma.category.create({
      data: { name },
    });
  }

  // 3. 카테고리 삭제
  async remove(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  // 4. 구독하기
  async subscribe(userId: string, categoryId: number) {
    try {
      return await this.prisma.subscription.create({
        data: {
          userId,
          categoryId: Number(categoryId),
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('이미 구독 중인 카테고리입니다.');
      }
      throw error;
    }
  }

  // 5. 구독 취소
  async unsubscribe(userId: string, categoryId: number) {
    return this.prisma.subscription.delete({
      where: {
        userId_categoryId: { // schema.prisma의 @@unique 설정 덕분에 가능!
          userId,
          categoryId: Number(categoryId),
        },
      },
    });
  }
}
