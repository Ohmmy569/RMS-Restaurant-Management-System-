import { Module } from "@nestjs/common";
import { PrismaService } from "@/providers/prisma.service";
import { UsagesService } from "@/apps/usages/usages.service";
import { TablesService } from "@/apps/tables/tables.service";
import { UsagesController } from "@/apps/usages/usages.controller";

@Module({
  controllers: [UsagesController],
  providers: [UsagesService, TablesService, PrismaService],
})
export class UsagesModule {}
