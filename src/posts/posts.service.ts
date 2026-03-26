import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { PrismaService } from '../../prisma/prisma.service'; // 구독 정보 조회를 위해 추가
import { HttpService } from '@nestjs/axios';            // 알림 서버 통신을 위해 추가
import { Post as IPost } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/response-post.dto';
import { v4 as uuid } from 'uuid';                   // 가짜 Device ID 생성을 위해 추가
import { from, mergeMap, retry, map, catchError, of } from 'rxjs';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    private readonly postsRepository: PostsRepository, // 기존 창고지기
    private readonly prisma: PrismaService,            // 구독자 찾기용
    private readonly httpService: HttpService,         // 알림 발송용
  ) {}

  // [C] Create - 글 저장 후 비동기 알림 발송 로직 추가
  async create(createPostDto: CreatePostDto, authorId: string): Promise<IPost> {
    // 1. 게시글 저장 (기존처럼 Repository 이용)
    const newPost = await this.postsRepository.create(createPostDto, authorId);

    // 2. 해당 카테고리를 구독 중인 유저 리스트 조회
    const subscribers = await this.prisma.subscription.findMany({
      where: { categoryId: newPost.categoryId },
      select: { userId: true },
    });

    // 3. 비동기로 알림 발송 (await를 쓰지 않아 즉시 반환됩니다!)
    if (subscribers.length > 0) {
      this.sendNotifications(subscribers, newPost.title);
    }

    // 4. 게시글 등록 결과는 즉시 반환 (사용자 대기 시간 없음)
    return newPost as IPost;
  }

  // [내부 로직] 비동기 알림 비서 (RxJS)
  private sendNotifications(subscribers: any[], postTitle: string) {
    from(subscribers)
      .pipe(
        mergeMap((sub) => {
          const deviceId = uuid();
          const url = 'http://localhost:8090/api/push'; // Docker 알림 서버 주소

          return this.httpService.post(url, { deviceId }).pipe(
            map((res) => {
              // 과제 조건: resultCode가 -1이면 에러로 간주
              if (res.data.resultCode === -1) {
                throw new Error('Push Server Error (-1)');
              }
              return res.data;
            }),
            retry(3), // 5% 에러 발생 시 최대 3번 재시도
            catchError((err) => {
              this.logger.error(`[알림 실패] 유저 ${sub.userId}: ${err.message}`);
              return of(null); // 한 명 실패해도 다른 사람 알림은 계속 가야 함
            }),
          );
        }),
      )
      .subscribe({
        next: (res) => {
          if (res) this.logger.log(`[알림 성공] 결과: ${JSON.stringify(res)}`);
        },
        complete: () => this.logger.log('--- 모든 구독자 알림 처리 프로세스 완료 ---'),
      });
  }

  // [R] Read - 게시글 ID로 단일 조회 (기존 유지)
  async findOneById(id: string): Promise<IPost> {
    const post = await this.postsRepository.findOneById(Number(id));
    if (!post) {
      throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
    }
    return post as IPost;
  }

  // [R] Read - 작성자 ID로 목록 조회 (기존 유지)
  async findAllByAuthorId(authorId: string): Promise<IPost[]> {
    const posts = await this.postsRepository.findAllByAuthorId(authorId);
    return posts as IPost[];
  }

  // [R] Read - 전체 조회 (기존 유지)
  async findAll(): Promise<PostResponseDto[]> {
    const posts = await this.postsRepository.findAll();
    return posts as any as PostResponseDto[];
  }

  // [U] Update - 게시글 수정 (기존 유지)
  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostResponseDto> {
    await this.findOneById(id);
    const updatedPost = await this.postsRepository.update(Number(id), updatePostDto);
    return updatedPost as IPost as PostResponseDto;
  }

  // [D] Delete - 게시글 삭제 (기존 유지)
  async delete(id: string): Promise<{ message: string }> {
    await this.findOneById(id);
    await this.postsRepository.delete(Number(id));
    return { message: `ID가 ${id}인 게시글이 성공적으로 삭제되었습니다.` };
  }
}