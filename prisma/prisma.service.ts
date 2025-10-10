// src/prisma/prisma.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// PrismaClient를 상속받아 NestJS의 라이프사이클에 연결.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // DB 연결 로그를 활성화하여 터미널에서 쿼리를 확인가능.
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  // NestJS 모듈이 초기화될 때 DB에 연결!!!!
  async onModuleInit() {
    await this.$connect();
    console.log('PrismaService: Database connected successfully.');
  }

  // NestJS 모듈이 종료될 때 DB 연결을 끊음.
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('PrismaService: Database disconnected.');
  }
}

//이 파일 중요, nestjs와 prisma 연결하는 파일. prisma client를 상속받아 사용함.