import { ApiProperty } from '@nestjs/swagger';

/**
 * @ApiResponse 데코레이터에 사용되는 응답 전용 DTO
 * DB에서 조회된 Post 모델의 필드를 클라이언트에게 반환할 구조를 정의함.
 */
export class PostResponseDto {
  @ApiProperty({ description: '게시글 ID (Int)', example: 1 })
  id: number;

  @ApiProperty({ description: '작성자 ID (String)', example: 'user-uuid-here' })
  authorId: string;

  // 카테고리 ID가 없으면 컨트롤러에서 에러가 남.
  @ApiProperty({ description: '카테고리 ID (Int)', example: 1 })
  categoryId: number; 

  @ApiProperty({ description: '게시글 제목 (String)', example: 'Response DTO 적용 완료' })
  title: string;

  @ApiProperty({ description: '게시글 내용 (String)', example: '이제 Swagger 문서에 응답 스키마가 정확히 표시됩니다.' })
  content: string;

  @ApiProperty({ 
    description: '생성 일시 (DateTime)', 
    type: 'string', 
    format: 'date-time' 
  })
  createdAt: Date;

  @ApiProperty({ 
    description: '수정 일시 (DateTime)', 
    type: 'string', 
    format: 'date-time' 
  })
  updatedAt: Date;
}
