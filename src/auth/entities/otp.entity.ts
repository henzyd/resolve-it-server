import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "~/user/entities/user.entity";

@Entity()
export class Otp {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  code: number;

  @ManyToOne(() => User, (user) => user.otps, {
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: "timestamptz" })
  expired_at: Date;
}
