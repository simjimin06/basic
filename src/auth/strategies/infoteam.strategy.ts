import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import axios from 'axios';
import { PrismaService } from '../../../prisma/prisma.service'; 

@Injectable()
export class InfoteamStrategy extends PassportStrategy(Strategy, 'infoteam') {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async validate(token: string) {
    console.log('*****************************************');
    console.log('1. [검증 시작] 토큰 확인 완료'); 

    try {
      const response = await axios.get('https://api.idp.gistory.me/oauth/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('2. [IDP 응답 데이터]:', response.data);

      // 💡 [수정 포인트] IDP가 주는 실제 필드명(student_id)에 맞게 가져옵니다.
      const { sub, email, student_id } = response.data;

      // 이름(name)이 없으므로, 학번을 우선 사용하고 없으면 이메일 앞자리를 씁니다.
      const userName = student_id || (email ? email.split('@')[0] : 'Gistory유저');

      console.log('3. [최종 유저 정보] sub:', sub, '이름으로 쓸 값:', userName);

      if (!sub) {
        throw new UnauthorizedException('sub 정보가 없습니다.');
      }

      // 이제 userName이 절대 undefined가 아니므로 Prisma가 에러를 내지 않습니다.
      const user = await this.prisma.user.upsert({
        where: { sub: sub },
        update: { 
          name: userName, 
          email: email 
        },
        create: { 
          sub: sub, 
          name: userName, 
          email: email 
        },
      });

      console.log('4. [DB 저장 성공!] 유저 ID:', user.id);
      console.log('*****************************************');
      return user;

    } catch (error) {
      console.log('❌ [에러 발생!]');
      console.error('상세 내용:', error.response?.data || error.message);
      throw new UnauthorizedException('인증 처리 중 오류가 발생했습니다.');
    }
  }
}