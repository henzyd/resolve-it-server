import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmpty, IsString } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsEmpty()
  first_name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsEmpty()
  last_name: string;
}
