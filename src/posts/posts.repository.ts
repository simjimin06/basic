import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
// Prisma에서 생성해준 Post 타입을 직접 쓰면 인터페이스 관리가 훨씬 편하대..
import { Post } from '@prisma/client'; 

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // [C] Create - 카테고리 ID를 반드시 포함해야 합니다.
  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    return await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        authorId: authorId,
        // 핵심: DTO에서 넘어온 categoryId를 DB에 넣어준다.
        categoryId: createPostDto.categoryId, 
      },
    });
  }

  // [R] Read - 게시글 ID로 단일 조회
  async findOneById(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { id: id },
      include: { category: true } // 카테고리 정보도 같이 보고 싶다면 추가
    });
  }

  // [R] Read - 작성자 ID로 목록 조회
  async findAllByAuthorId(authorId: string): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: { authorId: authorId },
    });
  }

  // [R] Read - 전체 조회
  async findAll(): Promise<Post[]> {
    return this.prisma.post.findMany({
      include: { category: true } // 어느 카테고리 글인지 같이 가져온다.
    });
  }

  // [U] Update - 게시글 수정
  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    return await this.prisma.post.update({
      where: { id: id },
      data: {
        title: updatePostDto.title,
        content: updatePostDto.content,
        // 수정 시에도 카테고리를 바꿀 수 있다면 추가하기
        categoryId: updatePostDto.categoryId, 
      },
    });
  }

  // [D] Delete - 게시글 삭제
  async delete(id: number): Promise<void> {
    await this.prisma.post.delete({
      where: { id: id },
    });
  }
}