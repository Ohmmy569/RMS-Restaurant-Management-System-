import { hash } from "bcrypt";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/providers/prisma.service";
import { CreateUserDto, UpdateUserDto } from "@/apps/users/users.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        email: true,
        telephone: true,
      },
    });
  }

  async findcount() {
    return await this.prisma.user.count();
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async create(data: CreateUserDto) {
    const hashedPassword = await hash(data.password, 10);

    return await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        email: true,
        telephone: true,
      },
    });
  }

  async updateById(id: string, data: UpdateUserDto) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        email: true,
        telephone: true,
      },
    });
  }

  async deleteById(id: string) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        email: true,
        telephone: true,
      },
    });
  }
}
