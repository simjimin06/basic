//회원가입, 로그인 dto

import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ description: '사용자 로그인 ID (고유해야 함)', example: 'simjimin' })
  @IsNotEmpty({ message: '사용자 ID는 필수' })
  @IsString({ message: '사용자 ID는 문자열' })
  userId: string;

  @ApiProperty({ description: '비밀번호 (최소 6자)', example: 'password123' })
  @IsNotEmpty({ message: '비밀번호는 필수' })
  @IsString({ message: '비밀번호는 문자열' })
  @MinLength(6, { message: '비밀번호는 최소 6자 이상' })
  password: string;
}