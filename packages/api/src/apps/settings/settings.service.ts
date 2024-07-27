import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/providers/prisma.service";

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.setting.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async findByName(name: string) {
    return this.prisma.setting.findUnique({
      where: {
        name,
      },
    });
  }

  async updateByName(name: string, value: string) {
    return this.prisma.setting.update({
      where: {
        name,
      },
      data: {
        value,
      },
    });
  }
}
