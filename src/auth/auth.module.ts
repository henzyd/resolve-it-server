import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { User } from "~/user/entities/user.entity";
import { JwtStrategy } from "~/common/strategies/jwt.strategy";
import { LocalStrategy } from "~/common/strategies/local.strategy";
import { UserService } from "~/user/user.service";
import { Otp } from "./entities/otp.entity";
import { BlacklistToken } from "./entities/blacklist-token.entity";
import { MailService } from "~/mail/mail.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Otp]),
    TypeOrmModule.forFeature([BlacklistToken]),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserService,
    MailService,
    JwtService,
  ],
})
export class AuthModule {}
