import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('EXCEPTION');

  catch(exception: HttpException, host: ArgumentsHost) {
  const ctx = host.switchToHttp();
  const response = ctx.getResponse<Response>();
  const request = ctx.getRequest<Request>();
  const status = exception.getStatus();
  const errorResponse = exception.getResponse(); // 이게 곧 에러 응답의 Body입니다.
  const timestamp = new Date().toISOString();

  // --- [ERR] 응답 로깅 (에러 시) ---
  // 요구사항: url, method, timestamp, status, response body 포함
  this.logger.error(
    `[ERR] ${request.method} ${request.url} - ${timestamp} | Status: ${status} | Response: ${JSON.stringify(errorResponse)}`
  );

  // 클라이언트에게는 구조화된 JSON 응답을 보내줌 (이건 과제 규격에 맞게!)
  response.status(status).json({
    method: request.method,
    url: request.url,
    status,
    timestamp,
    error: errorResponse,
  });
}
}