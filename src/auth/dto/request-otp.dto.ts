import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RequestOtp {
  @ApiProperty({ example: "example@gmail.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
