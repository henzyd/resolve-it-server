import { Controller, Post, Body, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LocalAuthGuard } from "~/common/guards/local-auth.guard";
import { AuthenticatedRequest } from "~/common/types/auth-request";
import { JwtAuthGuard } from "~/common/guards/jwt-auth.guard";
import { RequestOtp } from "./dto/request-otp.dto";
import { VerifyOtp } from "./dto/verify-otp.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Request() req: AuthenticatedRequest) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  logout(@Body() { refresh_token }: { refresh_token: string }) {
    return this.authService.logout(refresh_token);
  }

  @Post("jwt/refresh")
  refreshToken(@Body() { refresh_token }: { refresh_token: string }) {
    return this.authService.refreshToken(refresh_token);
  }

  @Post("otp/new")
  requestOtp(@Body() { email }: RequestOtp) {
    return this.authService.requestOtp(email);
  }

  @Post("otp/verify")
  verifyOtp(@Body() { otp }: VerifyOtp) {
    return this.authService.verifyOtp(otp);
  }
}
