import { Module } from "@nestjs/common";
import { MenusService } from "@/apps/menus/menus.service";
import { PrismaService } from "@/providers/prisma.service";
import { OrdersService } from "@/apps/orders/orders.service";
import { TablesService } from "@/apps/tables/tables.service";
import { UsagesService } from "@/apps/usages/usages.service";
import { OrdersController } from "@/apps/orders/orders.controller";

@Module({
  controllers: [OrdersController],
  providers: [
    MenusService,
    OrdersService,
    TablesService,
    UsagesService,
    PrismaService,
  ],
})
export class OrdersModule {}
