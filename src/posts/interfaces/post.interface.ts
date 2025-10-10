// Interface는 데이터베이스 모델 역할을 하며, 게시글의 속성을 정의!
// DTO와는 달리, 이 데이터가 실제 Service에서 어떻게 저장되는지를 나타냄..

// 게시글 데이터의 형태를 정의하는 인터페이스(이걸 정의를 해야 DTO를 하던지 하지.)
export interface Post {
  id: number;
  authorId: string;
  title: string;
  content: string;
  createdAt: Date;
}
