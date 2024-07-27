import { Module } from "@nestjs/common";
import { PrismaService } from "@/providers/prisma.service";
import { SettingsService } from "@/apps/settings/settings.service";
import { SettingsController } from "@/apps/settings/settings.controller";

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, PrismaService],
})
export class SettingsModule {}
