import { IsString, IsNotEmpty, MinLength } from 'class-validator';
export class CreatePostDto {
  @IsNotEmpty({ message: '작성자 ID는 필수' })
  @IsString({ message: '작성자 ID는 문자열이어야' })
  authorId: string;

  @IsNotEmpty({ message: '제목은 필수' })
  @IsString({ message: '제목은 문자열이어야' })
  @MinLength(2, { message: '제목은 최소 2자 이상이어야' })
  title: string;

  @IsNotEmpty({ message: '내용은 필수' })
  @IsString({ message: '내용은 문자열이어야' })
  @MinLength(10, { message: '내용은 최소 10자 이상이어야' })
  content: string;
}