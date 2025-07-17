import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm";
import { User } from "~/user/entities/user.entity";

export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  subject: string;

  @Column()
  description: string;

  @Column({
    type: "enum",
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @Column({
    type: "enum",
    enum: TicketPriority,
  })
  priority: TicketPriority;

  @ManyToOne(() => User, (user) => user.tickets)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column("uuid")
  @RelationId((ticket: Ticket) => ticket.user)
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
