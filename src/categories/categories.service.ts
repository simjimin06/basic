import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; 

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. 모든 카테고리 목록 조회
  async findAll() {
    return this.prisma.category.findMany({
      where: { status: true },
    });
  }

  // 2. 카테고리 추가
  async create(name: string) {
    return this.prisma.category.create({
      data: { name },
    });
  }

  // 3. 카테고리 삭제 (Soft Delete)
  async remove(id: number) {
    return this.prisma.category.update({
      where: { id },
      data: { status: false },
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
        userId_categoryId: {
          userId,
          categoryId: Number(categoryId),
        },
      },
    });
  }

  // [과제 1 & 2] 전체 카테고리 통계
  async getCategoryStats() {
    const categories = await this.prisma.category.findMany({
      where: { status: true },
      select: {
        id: true,
        name: true,
        _count: {
          select: { posts: true, subscribers: true },
        },
      },
      orderBy: { id: 'asc' },
    });

    return categories.map((c) => ({
      categoryId: c.id,
      categoryName: c.name,
      postCount: c._count.posts,
      subscriberCount: c._count.subscribers,
    }));
  }

  // [과제 3-1] 내 정보 통계
  async getMyCategoryStats(userId: string) {
    const categories = await this.prisma.category.findMany({
      where: { status: true },
      select: {
        id: true,
        name: true,
        subscribers: {
          where: { userId: userId },
          select: { categoryId: true },
        },
        _count: {
          select: { posts: { where: { authorId: userId } } },
        },
      },
      orderBy: { id: 'asc' },
    });

    return categories.map((c) => ({
      categoryId: c.id,
      categoryName: c.name,
      isSubscribed: c.subscribers.length > 0,
      myPostCount: c._count.posts,
    }));
  }

  // [과제 3-2] 내 글 목록 페이징
  async getMyPosts(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const posts = await this.prisma.post.findMany({
      where: { authorId: userId, category: { status: true } },
      take: limit,
      skip: skip,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        category: { select: { name: true } },
      },
    });

    return posts.map((p) => ({
      postId: p.id,
      categoryName: p.category.name,
      title: p.title,
      createdAt: p.createdAt,
    }));
  }
}