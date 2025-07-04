import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthenticatedRequest } from "~/common/types/auth-request";
import { JwtAuthGuard } from "~/common/guards/jwt-auth.guard";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  findMe(@Request() req: AuthenticatedRequest) {
    return this.userService.findOne({ id: req.user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me")
  updateMe(@Request() req: AuthenticatedRequest, @Body() dto: UpdateUserDto) {
    return this.userService.update(req.user.id, dto);
  }
}
