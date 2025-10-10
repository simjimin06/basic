import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository/posts.repository';

@Module({
  providers: [PostsService, PostsRepository],
  controllers: [PostsController]
})
export class PostsModule {}
