import { Module } from "@nestjs/common";
import { AuthModule } from "@/apps/auth/auth.module";
import { MenusModule } from "@/apps/menus/menus.module";
import { UsersModule } from "@/apps/users/users.module";
import { BillsModule } from "@/apps/bills/bills.module";
import { TablesModule } from "@/apps/tables/tables.module";
import { OrdersModule } from "@/apps/orders/orders.module";
import { UsagesModule } from "@/apps/usages/usages.module";
import { SettingsModule } from "@/apps/settings/settings.module";

@Module({
  imports: [
    AuthModule,
    MenusModule,
    UsersModule,
    BillsModule,
    TablesModule,
    OrdersModule,
    UsagesModule,
    SettingsModule,
  ],
})
export class AppModule {}
