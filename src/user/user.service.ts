import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  create(dto: CreateUserDto) {
    const user = this.userRepo.create(dto);
    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find({
      order: {
        created_at: "DESC",
      },
    });
  }

  async findOne({ id, email }: { id?: string; email?: string }) {
    const user = await this.userRepo.findOneBy({ id, email });
    if (!user) {
      const identifier = id ? `ID: ${id}` : `Email: ${email}`;
      throw new NotFoundException(`User with ${identifier} not found`);
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne({ id });
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }
}
