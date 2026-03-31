import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, query, body } = request;
    const now = Date.now();
    const timestamp = new Date().toISOString(); // 요구사항: timestamp

    // --- 1. [REQ] 요청 로그 ---
    // 요구사항: url, method, timestamp 포함
    let reqLog = `[REQ] ${method} ${url} - ${timestamp}`;

    if (method === 'GET') {
      // 요구사항: GET일 때 query params 포함
      reqLog += ` | Query: ${JSON.stringify(query)}`;
    } else if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      // 요구사항: POST, DELETE, PUT일 때 request body 포함
      reqLog += ` | Body: ${JSON.stringify(body)}`;
    }
    this.logger.log(reqLog);

    return next.handle().pipe(
      // --- 2. [RES] 성공 응답 로그 (200, 201 등) ---
      tap((responseBody) => {
        const delay = Date.now() - now;
        // 요구사항: url, method, timestamp, status, response body 포함
        this.logger.log(
          `[RES] ${method} ${url} - ${timestamp} | Status: ${response.statusCode} (+${delay}ms) | Response: ${JSON.stringify(responseBody)}`,
        );
      }),

    );
  }
}