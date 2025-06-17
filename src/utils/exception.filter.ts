import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const status = exception.getStatus();

//     response.status(status).json({
//       statusCode: status,
//       path: request.url,
//       message: exception.message,
//       stack: exception.stack ? exception.stack.split('\n') : null,
//       cause: exception.cause ? exception.cause : null,
//     });
//   }
// }

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    // HttpException handling
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    }

    // Mongoose validation error handling
    else if (exception.name === 'ValidationError') {
      status = HttpStatus.BAD_REQUEST;
      const errors = Object.values(exception.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
        value: err.value,
      }));

      message = {
        error: 'Validation Failed',
        errors,
      };
    }

    response.status(status).json({
      statusCode: status,
      path: request.url,
      message,
      stack: exception.stack ? exception.stack.split('\n') : null,
      cause: exception.cause ? exception.cause : null,
    });
  }
}
