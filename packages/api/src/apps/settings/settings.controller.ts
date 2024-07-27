import { SettingsService } from "@/apps/settings/settings.service";
import { Body, Controller, Get, Param, Patch } from "@nestjs/common";

@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async findAll() {
    return this.settingsService.findAll();
  }

  @Get(":name")
  async findByName(@Param("name") name: string) {
    return this.settingsService.findByName(name);
  }

  @Patch(":name")
  async updateByName(
    @Param("name") name: string,
    @Body("value") value: string
  ) {
    return this.settingsService.updateByName(name, value);
  }
}
