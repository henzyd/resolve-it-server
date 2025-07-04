import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches } from "class-validator";

export class VerifyOtp {
  @ApiProperty({ example: 123456, description: "6-digit numeric OTP code" })
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: "OTP must be a 6-digit number" })
  otp: number;
}
