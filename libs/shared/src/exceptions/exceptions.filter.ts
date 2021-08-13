import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(Object)
export class ApiExceptionsFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: HttpException | Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let resultException: HttpException;

    if (exception instanceof HttpException) {
      resultException = exception;
    } else {
      resultException = new HttpException(
        exception.message,
        HttpStatus.BAD_REQUEST,
      );
    }

    const httpCode = resultException.getStatus();
    const errorResponse = resultException.getResponse();

    return response.status(httpCode).send(errorResponse);
  }
}
