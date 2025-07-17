import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { JwtAuthGuard } from "~/common/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "~/common/types/auth-request";

@UseGuards(JwtAuthGuard)
@Controller("tickets")
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  create(@Body() dto: CreateTicketDto, @Request() req: AuthenticatedRequest) {
    return this.ticketService.create({ ...dto, user_id: req.user.id });
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.ticketService.findAll(req.user.id);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    return this.ticketService.findOne(id, req.user.id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Request() req: AuthenticatedRequest,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketService.update(id, {
      ...updateTicketDto,
      user_id: req.user.id,
    });
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    return this.ticketService.remove(id, req.user.id);
  }
}
