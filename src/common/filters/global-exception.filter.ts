import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let message = "Internal server error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception.name === "JsonWebTokenError") {
      status = 401;
      message = "Invalid token";
    } else if (exception.name === "TokenExpiredError") {
      status = 401;
      message = "Token expired";
    } else if (exception.name === "NotBeforeError") {
      status = 401;
      message = "Token not active yet";
    }

    response.status(status).json({
      error: message,
    });
  }
}
