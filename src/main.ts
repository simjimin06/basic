import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  // DTO 유효성 검사 Pipe를 전역으로 적용. (과제 조건*)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // DTO 타입 변환 허용*
      whitelist: true, // DTO에 정의되지 않은 속성 제거
    }),
  );

  // Swagger API 문서 설정 (과제 조건)
  const config = new DocumentBuilder()
    .setTitle('NestJS 게시판 API')
    .setDescription('Postgres DB와 Prisma를 사용한 게시판 CRUD API 명세서입니다.')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http', scheme: 'bearer',
    }, 'user:jwt')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3000/api 에서 접근 가능!

  await app.listen(3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Swagger documentation available at: ${await app.getUrl()}/api`);
}
  
bootstrap();

//이 파일은 애플리케이션의 진입점. nestjs 앱을 생성하고 설정하는 부분!