import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request } from "express";
import { LoginDto } from "~/auth/dto/login.dto";
import { transformValidationErrors } from "../utils/validation";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const loginDto = plainToClass(LoginDto, request.body);
    const errors = await validate(loginDto);

    if (errors.length > 0) {
      const errorMessages = transformValidationErrors(errors);
      throw new BadRequestException(errorMessages);
    }

    const result = super.canActivate(context);

    return result as boolean | Promise<boolean>;
  }
}
