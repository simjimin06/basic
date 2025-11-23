import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, IsNotEmpty } from 'class-validator';

// 💡 CreatePostDto를 사용하지 않고, 모든 필드를 선택적(Optional)으로 직접 정의.
export class UpdatePostDto {
    @ApiProperty()
    @IsOptional()
    @IsString({ message: '제목은 문자열이어야 함.' })
    @MinLength(2, { message: '제목은 최소 2자 이상이어야 함.' })
    title?: string; // ?를 붙여 선택적 필드로 만든 것.

    @ApiProperty()
    @IsOptional()
    @IsString({ message: '내용은 문자열이어야 함.' })
    @MinLength(10, { message: '내용은 최소 10자 이상이어야 함.' })
    content?: string;
}
