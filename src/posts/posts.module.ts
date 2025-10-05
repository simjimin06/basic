import { Module } from '@nestjs/common';
import { PostController } from './posts.controller'
import { PostService } from './posts.service';

@Module({
    controllers: [PostController],
    providers: [PostService],
    exports:[PostService]

})

export class PostModule{}