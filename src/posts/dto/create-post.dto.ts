import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsNumber } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: '게시글 제목입니다.' })
  @IsNotEmpty({ message: '제목은 필수입니다.' })
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  @MinLength(2, { message: '제목은 최소 2자 이상이어야 합니다.' })
  title: string;

  @ApiProperty({ example: '게시글 내용입니다. 10자 이상 작성해 주세요.' })
  @IsNotEmpty({ message: '내용은 필수입니다.' })
  @IsString({ message: '내용은 문자열이어야 합니다.' })
  @MinLength(10, { message: '내용은 최소 10자 이상이어야 합니다.' })
  content: string;

  // 💡 추가된 부분: 어떤 카테고리에 글을 올릴지 결정하는 번호 (1: 공지, 2: Q&A 등)
  @ApiProperty({ example: 1, description: '카테고리 ID 번호' })
  @IsNotEmpty({ message: '카테고리 ID는 필수입니다.' })
  @IsNumber({}, { message: '카테고리 ID는 숫자여야 합니다.' })
  categoryId: number;
}