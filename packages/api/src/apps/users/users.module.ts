import { Module } from "@nestjs/common";
import { UsersService } from "@/apps/users/users.service";
import { PrismaService } from "@/providers/prisma.service";
import { UsersController } from "@/apps/users/users.controller";

@Module({
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
