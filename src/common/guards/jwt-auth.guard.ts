import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor() {
    super();
  }

  handleRequest<TUser = { email: string; id: string }>(
    err: any,
    user: { email: string; id: string },
    info: any, // Contains error details (like token expired, malformed, etc.)
    context: ExecutionContext,
  ): TUser {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string;

    if (err || !user) {
      throw err || new UnauthorizedException("Unauthorized");
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException(
        "Missing or malformed Authorization header",
      );
    }

    return user as TUser;
  }
}
