import { PartialType } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { CreateTicketDto } from "./create-ticket.dto";
import { TicketStatus } from "../entities/ticket.entity";

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @IsEnum(TicketStatus)
  @IsOptional()
  status: TicketStatus;

  user_id: string;
}
