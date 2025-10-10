import { Controller, Post, Get, Patch, Delete,
    Body, Param, UsePipes, ValidationPipe, NotFoundException,
 } from '@nestjs/common';
import {PostsService} from './posts.service';
import { Post as IPost }  from './interfaces/post.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostIdParam, AuthorIdParam } from './dto/params-post.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

//swagger ui에서 그룹핑하기 위한 태그 설정
@ApiTags('posts') 
@UsePipes(new ValidationPipe({ transform: true }))

@Controller('posts')

export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
    @ApiResponse({ status: 201, description: '게시글 생성 성공', type: Object })
    async createPost(@Body() createPostDto: CreatePostDto): Promise<IPost> {
        // Service 호출 앞에 await 추가 및 Controller 함수를 async로 선언
        return await this.postsService.create(createPostDto);
    }
    
    @Get()
    @ApiResponse({ status: 200, description: '모든 게시글 조회 성공', type: [Object] })
    async getAllPosts(): Promise<IPost[]> {
        // await 추가
        return await this.postsService.findAll(); 
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: '단일 게시글 조회 성공' })
    @ApiResponse({ status: 404, description: '게시글 없음' })
    async findOneById(@Param() params: PostIdParam): Promise<IPost> {
        // await 추가
        return await this.postsService.findOneById(params.id);
    }

    @Get('by-author/:authorId')
    @ApiResponse({ status: 200, description: '작성자별 게시글 목록 조회 성공' })
    async findAllByAuthorId(@Param() params: AuthorIdParam): Promise<IPost[]> {
        // await 추가
        return await this.postsService.findAllByAuthorId(params.authorId);
    }

    @Patch(':id')
    @ApiResponse({ status: 200, description: '게시글 수정 성공' })
    @ApiResponse({ status: 404, description: '게시글 없음' })
    async update(
        @Param() params: PostIdParam, 
        @Body() updatePostDto: UpdatePostDto,
    ): Promise<IPost> {
        if (Object.keys(updatePostDto).length === 0) {
            // 404가 아닌 400 Bad Request가 더 적절.
            throw new NotFoundException('수정할 내용(제목 또는 내용)을 제공해야 함.'); 
        }
        // await 추가
        return await this.postsService.update(params.id, updatePostDto);
    }
    
    @Delete(':id')
    @ApiResponse({ status: 200, description: '게시글 삭제 성공' })
    @ApiResponse({ status: 404, description: '게시글 없음' })
    async delete(@Param() params: PostIdParam): Promise<{ message: string }> {
        // await 추가
        return await this.postsService.delete(params.id);
    }
}




