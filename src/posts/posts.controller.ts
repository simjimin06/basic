import { Controller, Post, Get, Patch, Delete,
    Body, Param, UsePipes, ValidationPipe, NotFoundException,
 } from '@nestjs/common';
import {PostsService} from './posts.service';
import { Post }  from './interfaces/post.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostIdParam, AuthorIdParam } from './dto/params-post.dto';


@UsePipes(new ValidationPipe({ transform: true }))

@Controller('posts')

export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  createPost(@Body() createPostDto: CreatePostDto): Post {
    return this.postsService.create(createPostDto);
  }
  
 @Get()
  getAllPosts(): Post[] {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  findOneById(@Param() params: PostIdParam): Post {
    return this.postsService.findOneById(params.id);
  }

  @Get('by-author/:authorId')
  findAllByAuthorId(@Param() params: AuthorIdParam): Post[] {
    return this.postsService.findAllByAuthorId(params.authorId);
  }

  @Patch(':id')
  update(
    @Param() params: PostIdParam, 
    @Body() updatePostDto: UpdatePostDto,
  ): Post {
    if (Object.keys(updatePostDto).length === 0) {
      throw new NotFoundException('수정할 내용(제목 또는 내용)을 제공해야 합니다.');
    }
    return this.postsService.update(params.id, updatePostDto);
  }
  
  @Delete(':id')
  delete(@Param() params: PostIdParam): { message: string } {
    return this.postsService.delete(params.id);
  }
}



