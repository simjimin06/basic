import { Controller, Post, Delete, Get, Param, UseGuards, Req, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // 카테고리 전체 목록 보기
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  // 카테고리 추가 (관리자 기능이라고 가정)
  @Post()
  create(@Body('name') name: string) {
    return this.categoriesService.create(name);
  }

  // 구독하기
  @UseGuards(AuthGuard('infoteam')) // 👈 로그인 필수!
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
}
