import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { QueryFailedError } from "typeorm";

@Catch(QueryFailedError as new (...args: any[]) => QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error = exception as any;
    let message = "Database error occurred";
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (error.code) {
      case "23505":
        statusCode = HttpStatus.CONFLICT;
        message = this.handleUniqueConstraintError(error);
        break;

      case "23503":
        statusCode = HttpStatus.BAD_REQUEST;
        message = "Cannot delete/update record due to existing references";
        break;

      default:
        console.error("Unhandled database error:", {
          code: error.code,
          message: error.message,
          detail: error.detail,
          constraint: error.constraint,
        });
        message = "An unexpected database error occurred";
    }

    const errorResponse = {
      error: message,
    };

    response.status(statusCode).json(errorResponse);
  }

  private handleUniqueConstraintError(error: any): string {
    const detail = error.detail as string;

    if (detail) {
      const match = detail.match(/Key \(([^)]+)\)=/);
      if (match) {
        const field = match[1];
        return `${field} already exists`;
      }
    }

    return "This record already exists";
  }
}
