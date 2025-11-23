import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty({ message: '제목은 필수' })
  @IsString({ message: '제목은 문자열' })
  @MinLength(2, { message: '제목은 최소 2자 이상' })
  title: string;

  @ApiProperty()
  @IsNotEmpty({ message: '내용은 필수' })
  @IsString({ message: '내용은 문자열' })
  @MinLength(10, { message: '내용은 최소 10자 이상' })
  content: string;
}