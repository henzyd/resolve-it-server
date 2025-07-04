import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private jwtService: JwtService) {
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

    const token = authHeader.replace("Bearer ", "");

    try {
      this.jwtService.verify(token);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new UnauthorizedException("Access token has expired");
      }
      throw new UnauthorizedException("Invalid access token");
    }

    return user as TUser;
  }
}
