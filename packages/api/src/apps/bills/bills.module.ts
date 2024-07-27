import { Module } from "@nestjs/common";
import { BillsService } from "@/apps/bills/bills.service";
import { PrismaService } from "@/providers/prisma.service";
import { TablesService } from "@/apps/tables/tables.service";
import { UsagesService } from "@/apps/usages/usages.service";
import { BillsController } from "@/apps/bills/bills.controller";
import { SettingsService } from "@/apps/settings/settings.service";

@Module({
  controllers: [BillsController],
  providers: [
    BillsService,
    UsagesService,
    TablesService,
    SettingsService,
    PrismaService,
  ],
})
export class BillsModule {}
