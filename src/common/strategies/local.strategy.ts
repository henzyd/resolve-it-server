import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "~/auth/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "email",
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateCredentials(email, password);
    if (!user) {
      throw new UnauthorizedException("User does not exist");
    }
    return user;
  }
}
