import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, Matches } from "class-validator";

export class VerifyOtp {
  @ApiProperty({
    example: "123456",
    description: "6-digit numeric OTP code",
    type: String,
  })
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: "OTP must be a 6-digit number" })
  @Transform(({ value }) => String(value))
  otp: string;
}
