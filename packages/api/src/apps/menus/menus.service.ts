import { Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/providers/prisma.service";

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.menu.findMany();
  }

  async findcount() {
    return await this.prisma.menu.count();
  }

  async findOne(args: Prisma.MenuFindUniqueOrThrowArgs) {
    return await this.prisma.menu.findUniqueOrThrow(args);
  }

  async findById(id: string) {
    return await this.prisma.menu.findUnique({
      where: {
        id,
      },
    });
  }

  async findMultipleByIds(ids: string[]) {
    return await this.prisma.menu.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async create(args: Prisma.MenuCreateArgs) {
    return await this.prisma.menu.create(args);
  }

  async update(args: Prisma.MenuUpdateArgs) {
    return await this.prisma.menu.update(args);
  }

  async remove(args: Prisma.MenuDeleteArgs) {
    return await this.prisma.menu.delete(args);
  }
}
