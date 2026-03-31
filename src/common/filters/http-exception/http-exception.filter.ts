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
    const errorResponse = exception.getResponse();

    const log = {
      method: request.method,
      url: request.url,
      status,
      timestamp: new Date().toISOString(),
      error: errorResponse,
    };

    // 에러 로깅
    this.logger.error(`[ERR] ${JSON.stringify(log)}`);

    response.status(status).json(log);
  }
}
