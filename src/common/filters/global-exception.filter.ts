import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger("Global Filter");

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let message = "Internal server error";

    if (exception.name === "JsonWebTokenError") {
      status = 401;
      message = "Invalid token 'ddmm'";
      console.log(exception);
    } else if (exception.name === "TokenExpiredError") {
      status = 401;
      message = "Token expired";
    } else if (exception.name === "NotBeforeError") {
      status = 401;
      message = "Token not active yet";
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else {
      this.logger.error(exception.message, exception);
    }

    response.status(status).json({
      error: message,
    });
  }
}
