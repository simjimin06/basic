import { Controller, Post, Get, Patch, Delete,
    Body, Param, UsePipes, ValidationPipe, NotFoundException, 
    UseInterceptors, ClassSerializerInterceptor 
 } from '@nestjs/common';
import {PostsService} from './posts.service';
import { Post as PrismaPost } from '@prisma/client'; 
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostIdParam, AuthorIdParam } from './dto/params-post.dto';
import { ApiResponse, ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger'; 
import { PostResponseDto } from './dto/response-post.dto';

// 모든 메서드의 반환값을 자동으로 PostResponseDto 형태로 변환
@UseInterceptors(ClassSerializerInterceptor) 

//swagger ui에서 그룹핑하기 위한 태그 설정
@ApiTags('posts') 
@UsePipes(new ValidationPipe({ transform: true }))

@Controller('posts')

export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
    @ApiCreatedResponse({description: '게시글 생성 성공', type: PostResponseDto })
    async createPost(@Body() createPostDto: CreatePostDto): Promise<PrismaPost> {
        // Service 호출 앞에 await 추가 및 Controller 함수를 async로 선언
        return await this.postsService.create(createPostDto);
    }
    
    @Get()
    @ApiResponse({ status: 200, description: '모든 게시글 조회 성공', type: [PostResponseDto]}) 
    async getAllPosts(): Promise<PrismaPost[]> {
        // await 추가
        return await this.postsService.findAll(); 
    }

    @Get(':id')
    @ApiOkResponse({ description: '단일 게시글 조회 성공', type: PostResponseDto }) 
    @ApiResponse({ status: 404, description: '게시글 없음' })
    async findOneById(@Param() params: PostIdParam): Promise<PrismaPost>{ 
        // await 추가
        return await this.postsService.findOneById(params.id);
    }

    @Get('by-author/:authorId')
    @ApiOkResponse({ description: '작성자별 게시글 목록 조회 성공', type: [PostResponseDto] }) 
    async findAllByAuthorId(@Param() params: AuthorIdParam): Promise<PrismaPost[]> {

        return await this.postsService.findAllByAuthorId(params.authorId);
    }

    @Patch(':id')
    @ApiOkResponse({ description: '게시글 수정 성공', type: PostResponseDto }) 
    @ApiResponse({ status: 404, description: '게시글 없음' })
    async update(
        @Param() params: PostIdParam, 
        @Body() updatePostDto: UpdatePostDto,
    ): Promise<PrismaPost> {

        if (Object.keys(updatePostDto).length === 0) { 
            throw new NotFoundException('수정할 내용(제목 또는 내용)을 제공해야 함.'); 
        }

        return await this.postsService.update(params.id, updatePostDto);
    }
    
    @Delete(':id')
    // 삭제 성공 시 반환되는 객체의 구조를 명시 (삭제 메시지)
    @ApiOkResponse({ 
      description: '게시글 삭제 성공', 
      schema: { 
        type: 'object', 
        properties: { 
          message: { type: 'string', example: 'ID가 1인 게시글이 성공적으로 삭제되었습니다.' } 
        } 
      } 
    }) 
    @ApiResponse({ status: 404, description: '게시글 없음' })
    async delete(@Param() params: PostIdParam): Promise<{ message: string }> {
        return await this.postsService.delete(params.id);
    }
}




