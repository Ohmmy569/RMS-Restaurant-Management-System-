import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthService } from "@/apps/auth/auth.service";
import { UsersService } from "@/apps/users/users.service";
import { AuthGuard } from "@/apps/auth/guards/auth.guard";
import { PrismaService } from "@/providers/prisma.service";
import { AuthController } from "@/apps/auth/auth.controller";
import { TablesService } from "@/apps/tables/tables.service";

@Module({
  exports: [AuthService],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: "1d",
      },
    }),
  ],
  providers: [
    AuthService,
    UsersService,
    TablesService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
