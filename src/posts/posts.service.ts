import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from './posts.repository/posts.repository';
import { Post as IPost } from './interfaces/post.interface'; 
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';


@Injectable()
export class PostsService {
  // PostsRepository를 주입받음.
    constructor(private readonly postsRepository: PostsRepository) {}

  // [C] Create
    async create(createPostDto: CreatePostDto): Promise<IPost> {
        return this.postsRepository.create(createPostDto);
    }

  // [R] Read - 게시글 ID로 단일 조회 (NotFoundException 처리?)
    async findOneById(id: string): Promise<IPost> {
        // findOneById는 DB에서 id를 숫자로 다루기 때문에 Number()로 변환됨.
        const post = await this.postsRepository.findOneById(Number(id));
        if (!post) {
            throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
        }
        return post;
    }

     // [R] Read - 작성자 ID로 목록 조회
    async findAllByAuthorId(authorId: string): Promise<IPost[]> {
        return this.postsRepository.findAllByAuthorId(authorId);
    }


    // [R] Read - 전체 조회
    async findAll(): Promise<IPost[]> {
        return this.postsRepository.findAll();
    }


     // [U] Update - 게시글 수정
    async update(id: string, updatePostDto: UpdatePostDto): Promise<IPost> {
        // 수정 전 해당 ID의 게시글이 있는지 확인 (에러 핸들링*)
        await this.findOneById(id); 

        return this.postsRepository.update(Number(id), updatePostDto);
    }
    // [D] Delete - 게시글 삭제
    async delete(id: string): Promise<{ message: string }> {
        // 삭제 전 해당 ID의 게시글이 있는지 확인
        await this.findOneById(id); 
        
        await this.postsRepository.delete(Number(id));
        
        return { message: `ID가 ${id}인 게시글이 성공적으로 삭제되었습니다.` };
    }
}
