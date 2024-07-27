import { Prisma } from "@prisma/client";
import { TablesService } from "@/apps/tables/tables.service";
import { Public } from "@/apps/auth/decorators/public.decorator";
import { CreateTableDto, UpdateTableDto } from "@/apps/tables/tables.dto";
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

@Controller("tables")
export class TablesController {
  constructor(private readonly tableService: TablesService) {}

  @Public()
  @Get()
  async findAll() {
    return this.tableService.findAll();
  }

  @Get("count")
  async findcount() {
    return this.tableService.findcount();
  }

  @Get(":id")
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const table = await this.tableService.findById(id);

    if (!table) {
      throw new NotFoundException();
    }

    return table;
  }

  @Post()
  async create(@Body() data: CreateTableDto) {
    try {
      return await this.tableService.create(data);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException();
        }
      }
    }
  }

  @Patch(":id")
  async updateById(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() data: UpdateTableDto
  ) {
    await this.findById(id);

    try {
      return this.tableService.updateById(id, data);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException();
        }
      }
    }
  }

  @Patch("/idle/:id")
  async cancel(@Param("id", ParseUUIDPipe) id: string) {
    return await this.tableService.updateStatusById(id, "IDLE");
  }

  @Patch("/eating/:id")
  async eating(@Param("id", ParseUUIDPipe) id: string) {
    return await this.tableService.updateStatusById(id, "EATING");
  }

  @Delete(":id")
  async deleteById(@Param("id", ParseUUIDPipe) id: string) {
    await this.findById(id);

    return this.tableService.deleteById(id);
  }
}
