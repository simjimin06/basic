import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PostsService } from '../posts.service';

@Injectable()
export class OwnerAuthGuard implements CanActivate {
  // PostsService를 주입받아 게시글 정보를 조회합니다.
  constructor(private readonly postsService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // 1. JWT Strategy를 통해 req.user에 담긴 사용자 정보를 가져옵니다.
    const user = request.user; 
    
    // 2. 요청 경로에서 게시글 ID를 가져옵니다. (PATCH /posts/:id 에서 :id)
    const postId = request.params.id; 

    if (!user || !postId) {
        // 이 Guard는 JwtAuthGuard 뒤에 실행되므로, user가 없으면 Forbidden을 반환합니다.
        throw new ForbiddenException('인증된 사용자 정보가 누락되었습니다.');
    }

    // 3. PostsService를 통해 게시글 정보를 가져옵니다.
    const post = await this.postsService.findOneById(postId);

    // 4. 인가 로직: 현재 사용자의 userId와 게시글의 authorId를 비교합니다.
    if (post.authorId !== user.userId) {
      // ID가 일치하지 않으면 403 Forbidden 에러 발생
      throw new ForbiddenException('본인이 작성한 게시글만 수정/삭제할 수 있습니다.');
    }
    
    // ID가 일치하면 접근을 허용합니다.
    return true; 
  }
}