import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interfaces/post.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';


@Injectable()
export class PostsService {

  private lastPostId: number = 2;

     // DB 역할을 하는 더미 데이터 배열 (메모리에 저장)
  private posts: Post[] = [
    {
      id: '1',
      authorId: 'user-1',
      title: '첫 번째 게시글입니다.',
      content: '이게 말이 돼..?',
      createdAt: new Date(),
    },
    {
      id: '2',
      authorId: 'user-2',
      title: '두 번째 작성자의 글',
      content: '제발 살려주세요ㅜ',
      createdAt: new Date(),
    },
  ];

  // [C] Create 로직
  create(createPostDto: CreatePostDto): Post { 
        // ID를 1 증가시키고 문자열로 변환하여 할당.
        this.lastPostId += 1;
        const newPost: Post = {
            id: String(this.lastPostId), // 자동 증가된 ID 사용
            createdAt: new Date(),
            ...createPostDto,
        };
        this.posts.push(newPost);
        return newPost;
    }

  // [R] Read - 게시글 ID로 단일 조회
  findOneById(id: string): Post {
    const post = this.posts.find((p) => p.id === id);
    if (!post) {
      throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
    }
    return post;
  }

  // [R] Read - 작성자 ID로 목록 조회
  findAllByAuthorId(authorId: string): Post[] {
    return this.posts.filter((p) => p.authorId === authorId);
  }
  // [R] Read - 전체 조회 (Controller에서 사용)
  getAllPosts(): Post[] {
    return this.posts;
  }

  // [U] Update - 게시글 수정
  update(id: string, updatePostDto: UpdatePostDto): Post {
    const postIndex = this.posts.findIndex((p) => p.id === id);

    if (postIndex === -1) {
      throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
    }

    const updatedPost: Post = {
      ...this.posts[postIndex],
      ...updatePostDto,
    };

    this.posts[postIndex] = updatedPost;
    return updatedPost;
  }

  // [D] Delete - 게시글 삭제
  delete(id: string): { message: string } {
    const initialLength = this.posts.length;
    this.posts = this.posts.filter((p) => p.id !== id);

    if (this.posts.length === initialLength) {
      throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
    }

    return { message: `ID가 ${id}인 게시글이 성공적으로 삭제되었습니다.` };
  }

}
