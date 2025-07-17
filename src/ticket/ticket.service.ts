import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { Ticket } from "./entities/ticket.entity";

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
  ) {}

  create(dto: CreateTicketDto) {
    const ticket = this.ticketRepo.create(dto);
    return this.ticketRepo.save(ticket);
  }

  findAll(user_id: string) {
    return this.ticketRepo.find({ where: { user_id } });
  }

  async findOne(id: string, user_id: string) {
    const ticket = await this.ticketRepo.findOneBy({ id, user_id });
    if (!ticket) throw new NotFoundException("Ticket not found");
    return ticket;
  }

  async update(id: string, dto: UpdateTicketDto) {
    const ticket = await this.findOne(id, dto.user_id);
    Object.assign(ticket, dto);
    return this.ticketRepo.save(ticket);
  }

  async remove(id: string, user_id: string) {
    const result = await this.ticketRepo.delete({ id, user_id });
    if (result.affected === 0) {
      throw new NotFoundException("Ticket not found");
    }
    return { message: "Ticket deleted successfully" };
  }
}
