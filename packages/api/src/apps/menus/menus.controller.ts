import { join } from "path";
import { Response } from "express";
import { Prisma } from "@prisma/client";
import { createReadStream, existsSync } from "fs";
import { MenusService } from "@/apps/menus/menus.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Public } from "@/apps/auth/decorators/public.decorator";
import { CreateMenuDto, UpdateMenuDto } from "@/apps/menus/menus.dto";
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
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";

@Controller("menus")
export class MenusController {
  constructor(private readonly menuService: MenusService) {}

  @Get()
  async findAll() {
    return await this.menuService.findAll();
  }

  @Get("count")
  async findcount() {
    return await this.menuService.findcount();
  }

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    try {
      return await this.menuService.findOne({ where: { id } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") {
          throw new NotFoundException();
        }
      }

      throw e;
    }
  }

  @Public()
  @Get(":id/image")
  async findImage(
    @Param("id", ParseUUIDPipe) id: string,
    @Res() res: Response
  ) {
    const menu = await this.findOne(id);

    const exists = existsSync(
      join(__dirname, "..", "..", "..", "uploads/menus", menu.image)
    );

    if (exists) {
      createReadStream(
        join(__dirname, "..", "..", "..", "uploads/menus", menu.image)
      ).pipe(res);
    } else {
      throw new NotFoundException();
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async create(
    @Body() data: CreateMenuDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    try {
      return await this.menuService.create({
        data: {
          ...data,
          image: image.filename,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new ConflictException("Menu with this name already exists.");
        }
      }

      throw e;
    }
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("image"))
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() data: UpdateMenuDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    await this.findOne(id);

    try {
      return await this.menuService.update({
        where: { id },
        data: {
          ...data,
          image: image?.filename,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new ConflictException("Menu with this name already exists.");
        }
      }

      throw e;
    }
  }

  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.findOne(id);

    return await this.menuService.remove({
      where: { id },
    });
  }
}
