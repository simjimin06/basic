import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from './posts.repository/posts.repository';
import { Post as IPost } from '@prisma/client';  
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/response-post.dto';

@Injectable()
export class PostsService {
  // PostsRepository를 주입받음.
    constructor(private readonly postsRepository: PostsRepository) {}v
    

  // [C] Create
    async create(createPostDto: CreatePostDto): Promise<IPost> {
         const newPost = await this.postsRepository.create(createPostDto);
        // Prisma 모델을 그대로 반환
         return newPost as IPost; 
    }


  // [R] Read - 게시글 ID로 단일 조회 (NotFoundException 처리)
    async findOneById(id: string): Promise<IPost> { 
        // findOneById는 DB에서 id를 숫자로 다루기 때문에 Number()로 변환됨.
        const post = await this.postsRepository.findOneById(Number(id));
        if (!post) {
            throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
        }
        return post as IPost;
    }

     // [R] Read - 작성자 ID로 목록 조회
    async findAllByAuthorId(authorId: string): Promise<IPost[]> {
        const posts = await this.postsRepository.findAllByAuthorId(authorId);
       // Prisma 모델을 그대로 반환
        return posts as IPost[];
    }



    // [R] Read - 전체 조회
    async findAll(): Promise<IPost[]> {
        const posts = await this.postsRepository.findAll();
       // Prisma 모델을 그대로 반환
        return posts as IPost[];
    }


     // [U] Update - 게시글 수정
    async update(id: string, updatePostDto: UpdatePostDto): Promise<IPost> {
        // 수정 전 해당 ID의 게시글이 있는지 확인 (에러 핸들링*)
        await this.findOneById(id); 

        const updatedPost = await this.postsRepository.update(Number(id), updatePostDto);
        // Prisma 모델을 그대로 반환
        return updatedPost as IPost;
    }

    // [D] Delete - 게시글 삭제
    async delete(id: string): Promise<{ message: string }> {
        // 삭제 전 해당 ID의 게시글이 있는지 확인
        // findOneById의 반환값을 사용하지 않으므로 DTO 변환은 필요 없음.
        await this.findOneById(id); 
        
        await this.postsRepository.delete(Number(id));
        
        return { message: `ID가 ${id}인 게시글이 성공적으로 삭제되었습니다.` };
    }
}
