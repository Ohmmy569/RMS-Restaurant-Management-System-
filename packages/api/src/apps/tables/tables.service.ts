import { hash } from "bcrypt";
import { Injectable } from "@nestjs/common";
import { TableStatus } from "@prisma/client";
import { PrismaService } from "@/providers/prisma.service";
import { CreateTableDto, UpdateTableDto } from "@/apps/tables/tables.dto";

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.table.findMany({
      select: {
        id: true,
        name: true,
        seat: true,
        status: true,
      },
    });
  }

  async findcount() {
    return this.prisma.table.count();
  }

  async findById(id: string) {
    return this.prisma.table.findUnique({
      where: { id },
    });
  }

  async findByIdIncludePasscode(id: string) {
    return this.prisma.table.findUnique({
      where: { id },
    });
  }

  async create(data: CreateTableDto) {
    return this.prisma.table.create({
      data: {
        ...data,
        passcode: await hash(data.passcode, 10),
      },
      select: {
        id: true,
        name: true,
        seat: true,
        status: true,
      },
    });
  }

  async updateById(id: string, data: UpdateTableDto) {
    return this.prisma.table.update({
      where: { id },
      data: {
        ...data,
        passcode: data.passcode ? await hash(data.passcode, 10) : undefined,
      },
      select: {
        id: true,
        name: true,
        seat: true,
        status: true,
        passcode: true,
      },
    });
  }

  async updateStatusById(id: string, status: TableStatus) {
    return await this.prisma.table.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  async deleteById(id: string) {
    return this.prisma.table.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        seat: true,
        status: true,
      },
    });
  }
}
