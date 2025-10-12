import { ApiProperty } from '@nestjs/swagger';

/**
 * @ApiResponse 데코레이터에 사용되는 응답 전용 DTO
 * DB에서 조회된 Post 모델의 필드를 클라이언트에게 반환할 구조를 정의함.
 */

export class PostResponseDto {
  @ApiProperty({ description: '게시글 ID (Int)', example: 1 })
  id: number; // Prisma Int 타입은 TypeScript에서 number로 변환됨.

  @ApiProperty({ description: '작성자 ID (String)', example: 'user-test-id' })
  authorId: string;

  @ApiProperty({ description: '게시글 제목 (String)', example: 'Response DTO 적용 완료' })
  title: string;

  @ApiProperty({ description: '게시글 내용 (String)', example: '이제 Swagger 문서에 응답 스키마가 정확히 표시됩니다.' })
  content: string;

  @ApiProperty({ 
    description: '생성 일시 (DateTime)', 
    type: 'string', 
    format: 'date-time' // Swagger에서 날짜/시간 포맷으로 표시되도록 지정.
  })
    createdAt: Date; // Prisma DateTime 타입은 TypeScript에서 Date 객체로 변환됨.

  @ApiProperty({ 
    description: '수정 일시 (DateTime)', 
    type: 'string', 
    format: 'date-time' 
  })
  updatedAt: Date;
}
