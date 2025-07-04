import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import { SignupDto } from "./dto/signup.dto";
import { User } from "~/user/entities/user.entity";
import { UserService } from "~/user/user.service";
import { Otp } from "./entities/otp.entity";
import { BlacklistToken } from "./entities/blacklist-token.entity";
import { hashString } from "~/common/utils/helpers";

interface UserPayload {
  email: string;
  id: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Otp)
    private otpRepo: Repository<Otp>,
    @InjectRepository(BlacklistToken)
    private blacklistTokenRepo: Repository<BlacklistToken>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  private generateAccessToken(user: UserPayload): string {
    const payload = {
      sub: user.id,
      email: user.email,
      type: "access",
    };

    return this.jwtService.sign(payload, {
      expiresIn: "15m",
    });
  }

  private generateRefreshToken(user: UserPayload): string {
    const payload = {
      sub: user.id,
      email: user.email,
      type: "refresh",
    };

    return this.jwtService.sign(payload, {
      expiresIn: "7d",
    });
  }

  private async generateOtp(userId: string) {
    const code = Math.floor(100000 + Math.random() * 900000);
    const otp = this.otpRepo.create({
      code,
      expired_at: new Date(Date.now() + 5 * 60 * 1000),
      user_id: userId,
    });

    return await this.otpRepo.save(otp);
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.userService.findOne({ email });
    if (user && user.password === password) {
      const { password: _, ...result } = user;
      const isMatch = await this.comparePasswords(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException("Invalid credentials");
      }
      return result;
    }
    return null;
  }

  hashPassword(password: string) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  comparePasswords(plainText: string, hashed: string) {
    return bcrypt.compare(plainText, hashed);
  }

  async signup({ email, password, ...dto }: SignupDto) {
    const user = await this.userRepo.findOneBy({ email });
    if (user) throw new BadRequestException(`User with email already exist`);

    const hashedPassword = await this.hashPassword(password);
    const newUser = this.userRepo.create({
      ...dto,
      password: hashedPassword,
      email,
    });
    await this.userRepo.save(newUser);

    const otp = await this.generateOtp(newUser.id);

    return {
      message: "Signup successful. OTP sent to email.",
      otp: process.env.NODE_ENV === "development" ? otp.code : undefined,
    };
  }

  login(user: UserPayload) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      ...user,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async logout(refreshToken: string) {
    try {
      const payload = this.jwtService.decode(refreshToken);

      if (
        !payload ||
        typeof payload !== "object" ||
        payload["type"] !== "refresh"
      ) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const hashed = hashString(refreshToken);

      const expires_at = new Date((payload["exp"] as number) * 1000);
      const blacklisted_at = new Date();

      const entry = this.blacklistTokenRepo.create({
        token: hashed,
        expires_at,
        blacklisted_at,
      });

      await this.blacklistTokenRepo.save(entry);

      return {
        message: "Successfully logged out",
      };
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }

  async refreshToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token);

    if (payload.type !== "refresh") {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const hashedToken = hashString(token);
    const expires_at = new Date(payload.exp * 1000);
    const blacklisted_at = new Date();

    const alreadyBlacklisted = await this.blacklistTokenRepo.findOneBy({
      token: hashedToken,
    });

    if (!alreadyBlacklisted) {
      const entry = this.blacklistTokenRepo.create({
        token: hashedToken,
        expires_at,
        blacklisted_at,
      });

      await this.blacklistTokenRepo.save(entry);
    }

    console.log(payload);

    const user = { id: payload.sub, email: payload.email };

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async requestOtp(email: string) {
    const user = await this.userService.findOne({ email });
    if (!user.is_verified) throw new BadRequestException("User not verified");

    const otp = await this.generateOtp(user.id);

    return {
      message: "OTP has been generated and sent to your email address.",
      otp: process.env.NODE_ENV === "development" ? otp.code : undefined,
    };
  }

  async verifyOtp(code: number) {
    const otp = await this.otpRepo.findOneBy({ code });

    if (!otp) throw new BadRequestException("Invalid OTP code.");

    const now = new Date();
    if (otp.expired_at < now) throw new BadRequestException("OTP has expired.");

    const user = await this.userRepo.findOneBy({ id: otp.user_id });
    if (!user) throw new NotFoundException("User not found.");

    if (!user.is_verified) {
      await this.userRepo.update(user.id, { is_verified: true });
    }

    await this.otpRepo.delete(otp.id);

    // Send welcome email

    return {
      message: "OTP verified successfully.",
    };
  }
}
