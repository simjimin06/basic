
FROM node:22.20.0-alpine

# 2. 컨테이너 내부 작업 공간 설정
WORKDIR /usr/src/app

# 3. 패키지 설치를 위해 설정 파일만 먼저 복사
COPY package*.json ./

# 4. 의존성 라이브러리 설치 (이걸 여러 번 하면 당연히 시간이 오래 걸리니까 docker cashing함)
RUN npm install

# 5. Prisma 설정 폴더 복사 및 클라이언트 생성 
COPY prisma ./prisma/
RUN npx prisma generate

# 6. 모든 소스 코드 복사 (빌드 과정에서 필요한 모든 파일이 포함되어 있으며 src 폴더가 포함됨.)
COPY . .

# 7. 프로젝트 빌드 (dist 폴더가 생성)
RUN npm run build

# 8. 포트 3000번 열어야 함.
EXPOSE 3000

# 9. 서버 실행
CMD ["npm", "run", "start:prod"]