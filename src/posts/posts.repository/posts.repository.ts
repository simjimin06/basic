// src/posts/posts.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service'; // Prisma DB 연결 서비스
import { Post } from '../interfaces/post.interface'; // Post 타입
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

// Repository 계층은 DB와의 모든 통신을 전담
@Injectable()
export class PostsRepository {
  // PrismaService를 주입받아 DB 쿼리를 실행
  constructor(private readonly prisma: PrismaService) {}

  // [C] Create - 새로운 게시글 생성 (DB에 삽입)
  async create(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = await this.prisma.post.create({
      data: {
        authorId: createPostDto.authorId,
        title: createPostDto.title,
        content: createPostDto.content,
      },
    });
    return newPost;
  }

  // [R] Read - 게시글 ID로 단일 조회
  async findOneById(id: number): Promise<Post | null> {
    // findUnique는 PK(id)로 찾는 가장 효율적인 쿼리라고는 함.
    return this.prisma.post.findUnique({
      where: { id: id },
    });
  }

  // [R] Read - 작성자 ID로 목록 조회
  async findAllByAuthorId(authorId: string): Promise<Post[]> {
    // findMany는 여러 결과를 찾을 때 사용한다고 함.
    return this.prisma.post.findMany({
      where: { authorId: authorId },
    });
  }

  // [R] Read - 전체 조회
  async findAll(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }

  // [U] Update - 게시글 수정
  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    // update는 수정할 데이터(data)와 조건을 함께 전달한다.
    const updatedPost = await this.prisma.post.update({
      where: { id: id },
      data: updatePostDto,
    });
    return updatedPost;
  }

  // [D] Delete - 게시글 삭제
  async delete(id: number): Promise<void> {
    // delete는 조건(where)을 만족하는 하나의 레코드를 삭제한다고 함.(이 부분 좀 더 공부)
    await this.prisma.post.delete({
      where: { id: id },
    });
  }
}

//이 파일 중요**, DB와 직접 통신하는 부분. service에서 repository로 역할을 분담한 것임.