import { Prisma } from "@prisma/client";
import { UsersService } from "@/apps/users/users.service";
import { CreateUserDto, UpdateUserDto } from "@/apps/users/users.dto";
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
} from "@nestjs/common";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get("count")
  async findcount() {
    return await this.usersService.findcount();
  }

  @Get(":id")
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Post()
  async create(@Body() data: CreateUserDto) {
    try {
      return await this.usersService.create(data);
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
    @Body() data: UpdateUserDto
  ) {
    await this.findById(id);

    try {
      return await this.usersService.updateById(id, data);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException();
        }
      }
    }
  }

  @Delete(":id")
  async deleteById(@Param("id", ParseUUIDPipe) id: string) {
    await this.findById(id);

    return await this.usersService.deleteById(id);
  }
}
