import { Module } from "@nestjs/common";
import { PrismaService } from "@/providers/prisma.service";
import { TablesService } from "@/apps/tables/tables.service";
import { TablesController } from "@/apps/tables/tables.controller";

@Module({
  controllers: [TablesController],
  providers: [TablesService, PrismaService],
})
export class TablesModule {}
