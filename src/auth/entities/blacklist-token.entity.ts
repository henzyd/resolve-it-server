import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class BlacklistToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  token: string;

  @CreateDateColumn({ type: "timestamptz" })
  blacklisted_at: Date;

  @Column({ type: "timestamptz", nullable: true })
  expires_at: Date | null;
}
