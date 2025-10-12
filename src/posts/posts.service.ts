import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from './posts.repository/posts.repository';
import { Post as IPost } from './interfaces/post.interface'; 
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/response-post.dto';

@Injectable()
export class PostsService {
  // PostsRepository를 주입받음.
    constructor(private readonly postsRepository: PostsRepository) {}v

    /**
     * [추가] Prisma Post 모델을 PostResponseDto로 변환하는 헬퍼 함수
     * @param post Prisma에서 반환된 Post 모델 객체
     * @returns PostResponseDto 객체（IPost에서 얘로 바꿈）
     */
    private mapToDto(post: IPost): PostResponseDto {
      const postDto = new PostResponseDto();
      // IPost의 모든 필드를 PostResponseDto에 매핑
      // 현재 IPost와 PostResponseDto의 필드가 동일하다고 가정
      Object.assign(postDto, post); 
      return postDto;
    }

  // [C] Create
    async create(createPostDto: CreatePostDto): Promise<PostResponseDto> {
         const newPost = await this.postsRepository.create(createPostDto);
        //+ 생성된 Post 모델을 DTO로 변환하여 반환
        return this.mapToDto(newPost);
    }

  // [R] Read - 게시글 ID로 단일 조회 (NotFoundException 처리)
    async findOneById(id: string): Promise<PostResponseDto> { 
        // findOneById는 DB에서 id를 숫자로 다루기 때문에 Number()로 변환됨.
        const post = await this.postsRepository.findOneById(Number(id));
        if (!post) {
            throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
        }
        // + 조회된 Post 모델을 DTO로 변환하여 반환
        return this.mapToDto(post);
    }

     // [R] Read - 작성자 ID로 목록 조회
    async findAllByAuthorId(authorId: string): Promise<PostResponseDto[]> {
        const posts = await this.postsRepository.findAllByAuthorId(authorId);
        // + 조회된 Post 모델 배열을 DTO 배열로 변환
        return posts.map(post => this.mapToDto(post));
    }


    // [R] Read - 전체 조회
    async findAll(): Promise<PostResponseDto[]> {
        const posts = await this.postsRepository.findAll();
        // + 조회된 Post 모델 배열을 DTO 배열로 변환
        return posts.map(post => this.mapToDto(post));
    }


     // [U] Update - 게시글 수정
    async update(id: string, updatePostDto: UpdatePostDto): Promise<PostResponseDto> {
        // 수정 전 해당 ID의 게시글이 있는지 확인 (에러 핸들링*)
        await this.findOneById(id); 

        const updatedPost = await this.postsRepository.update(Number(id), updatePostDto);
        // + 수정된 Post 모델을 DTO로 변환하여 반환
        return this.mapToDto(updatedPost);
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
