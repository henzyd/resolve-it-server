import { Controller, Get, Request } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthenticatedRequest } from "src/common/types/auth-request";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // Add JWTGuard
  @Get("me")
  findMe(@Request() req: AuthenticatedRequest) {
    return this.userService.findMe(req.user.id);
  }
}
