import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

// 💡 게시글 ID 경로 파라미터 검증용 DTO
export class PostIdParam {
  @IsNotEmpty({ message: 'ID는 필수임.' })
  @IsString({ message: 'ID는 문자열이어야 함.' })
  id: string;
}
// 💡 작성자 ID 경로 파라미터 검증용 DTO
export class AuthorIdParam {
  @IsNotEmpty({ message: '작성자 ID는 필수임.' })
  @IsString({ message: '작성자 ID는 문자열이어야 함.' })
  authorId: string;
}