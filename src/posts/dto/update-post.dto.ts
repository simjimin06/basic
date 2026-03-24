import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, IsNumber } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: '제목은 문자열이어야 함.' })
  @MinLength(2, { message: '제목은 최소 2자 이상이어야 함.' })
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: '내용은 문자열이어야 함.' })
  @MinLength(10, { message: '내용은 최소 10자 이상이어야 함.' })
  content?: string;

  // 카테고리를 수정할 수도 있으니 추가
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber({}, { message: '카테고리 ID는 숫자여야 함.' })
  categoryId?: number;
}
