import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

// 게시글 ID 검증 DTO
export class PostIdParam {
  @ApiProperty()
  @IsNotEmpty({ message: 'ID는 필수' })
  @IsString({ message: 'ID는 문자열' })
  id: string;
}
// 작성자 ID 검증 DTO
export class AuthorIdParam {
  @ApiProperty()
  @IsNotEmpty({ message: '작성자 ID는 필수' })
  @IsString({ message: '작성자 ID는 문자열' })
  authorId: string;
}