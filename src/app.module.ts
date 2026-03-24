import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [PostsModule,PrismaModule, AuthModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

//prisma module= db 접근, post mudule=post 기능, auth module=인증 기능
