// src/prisma/prisma.module.ts

import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() 데코레이터를 붙여서, 한 번만 import해도 모든 모듈에서 PrismaService를 사용할 수 있게 해줌!
@Global() 
@Module({
  providers: [PrismaService],
  // 다른 모듈에서 PrismaService를 사용할 수 있도록 export
  exports: [PrismaService], 
})
export class PrismaModule {}