import { Controller, Post, Delete, Get, Param, UseGuards, Req, Body, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';


@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // 카테고리 전체 목록 보기(삭제되지 않은 카테고리를 보는 것)
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  // 카테고리 추가 (관리자 기능)
  @Post()
  create(@Body('name') name: string) {
    return this.categoriesService.create(name);
  }
  // 카테고리 삭제 (관리자 기능)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(Number(id));
  }


  // 구독하기
  @UseGuards(AuthGuard('infoteam')) // 로그인
  @Post(':id/subscribe')
  subscribe(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id; // Strategy에서 반환한 user.id
    return this.categoriesService.subscribe(userId, Number(id));
  }

  // 구독 취소하기
  @UseGuards(AuthGuard('infoteam'))
  @Delete(':id/unsubscribe')
  unsubscribe(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    return this.categoriesService.unsubscribe(userId, Number(id));
  }

  //과제 1,2 api
  @Get('stats')
  async getStats() {
    return this.categoriesService.getCategoryStats();
  }

  // [과제 3-1] 내 구독 현황 및 카테고리별 글 개수
  @UseGuards(AuthGuard('infoteam')) // 로그인한 유저만 접근 가능!
  @Get('me/stats')
  getMyStats(@Req() req: any) {
    const userId = req.user.id; // 하드코딩 제거! 로그인한 유저 정보 사용
    return this.categoriesService.getMyCategoryStats(userId);
  }

  // [과제 3-2] 내 글 목록 (페이지네이션)
  @UseGuards(AuthGuard('infoteam')) // 로그인한 유저만 접근 가능!
  @Get('me/posts')
  getMyPosts(
    @Req() req: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const userId = req.user.id;
    return this.categoriesService.getMyPosts(userId, Number(page), Number(limit));
  }
}
