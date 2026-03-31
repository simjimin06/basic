import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger} from '@nestjs/common';
import { Observable,tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, query, body } = request;
    const now = Date.now();
    const timestamp = new Date().toISOString();

    // 1. 요청(REQ) 로그
    let reqLog = `[REQ] ${method} ${url} - ${timestamp}`;
    if (method === 'GET') reqLog += ` | Query: ${JSON.stringify(query)}`;
    else reqLog += ` | Body: ${JSON.stringify(body)}`;
    this.logger.log(reqLog);

    return next.handle().pipe(
      tap((responseBody) => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;

        // 2. 응답(RES) 로그
        this.logger.log(
          `[RES] ${method} ${url} ${response.statusCode} - ${delay}ms | Response: ${JSON.stringify(responseBody)}`,
        );
      }),
    );
  }
}