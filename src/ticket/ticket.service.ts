import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { Ticket, TicketStatus } from "./entities/ticket.entity";

// Define the raw query result interface
interface TicketStats {
  total_tickets: string;
  total_opened: string;
  total_closed: string;
  total_resolved: string;
}

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

  async getStats(user_id: string) {
    const stats = await this.ticketRepo
      .createQueryBuilder("ticket")
      .select([
        "COUNT(*) as total_tickets",
        "COUNT(CASE WHEN status = :open THEN 1 END) as total_opened",
        "COUNT(CASE WHEN status = :closed THEN 1 END) as total_closed",
        "COUNT(CASE WHEN status = :resolved THEN 1 END) as total_resolved",
      ])
      .where("ticket.user_id = :user_id")
      .setParameters({
        user_id,
        open: TicketStatus.OPEN,
        closed: TicketStatus.CLOSED,
        resolved: TicketStatus.RESOLVED,
      })
      .getRawOne<TicketStats>();

    if (!stats) {
      return {
        total_tickets: 0,
        total_opened: 0,
        total_closed: 0,
        total_resolved: 0,
      };
    }

    return {
      total_tickets: parseInt(stats.total_tickets),
      total_opened: parseInt(stats.total_opened),
      total_closed: parseInt(stats.total_closed),
      total_resolved: parseInt(stats.total_resolved),
    };
  }
}
