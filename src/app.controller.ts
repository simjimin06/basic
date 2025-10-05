import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { TestDto } from './app.dto';

@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  getHello(@Query('test',ParseIntPipe) test: number): string {
    console.log(test)
    return this.appService.getHello();
  }

  @Delete()
  postHello(): string {
    return "test"
  }
}
