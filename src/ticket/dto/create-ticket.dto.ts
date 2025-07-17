import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { TicketPriority } from "../entities/ticket.entity";

export class CreateTicketDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: TicketPriority })
  @IsEnum(TicketPriority)
  @IsNotEmpty()
  priority: TicketPriority;

  user_id: string;
}
