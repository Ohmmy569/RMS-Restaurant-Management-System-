import { Request, Response } from "express";
import { AuthService } from "@/apps/auth/auth.service";
import { UsersService } from "@/apps/users/users.service";
import { CurrentClient } from "@/apps/auth/types/auth.type";
import { Public } from "@/apps/auth/decorators/public.decorator";
import { Client } from "@/apps/auth/decorators/client.decorator";
import {
  ChangePasswordDto,
  LogInDto,
  TableLoginDto,
} from "@/apps/auth/auth.dto";
import {
  Body,
  Controller,
  Post,
  Get,
  UnauthorizedException,
  BadRequestException,
  Patch,
  Param,
  ParseUUIDPipe,
  Req,
  Res,
} from "@nestjs/common";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Get("profile")
  async profile(@Client() user: CurrentClient) {
    return this.usersService.findById(user.id);
  }

  @Get("check-session")
  async checkSession(@Req() req: Request) {
    const token = req.cookies?.token;

    if (!token) {
      throw new UnauthorizedException("INVALID_SESSION");
    }

    try {
      await this.authService.checkSession(token);

      return {
        message: "valid session",
      };
    } catch (e) {
      throw new UnauthorizedException("INVALID_SESSION");
    }
  }

  @Public()
  @Post("table-login")
  async tableLogin(
    @Body() data: TableLoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      const table = await this.authService.tableLogin(data);

      res.cookie("token", table.token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
      });

      delete table.token;

      return table;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "INVALID_CREDENTIALS") {
          throw new UnauthorizedException("INVALID_CREDENTIALS");
        }
      }

      throw error;
    }
  }

  @Public()
  @Post("login")
  async logIn(
    @Body() data: LogInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      const user = await this.authService.logIn(data);

      res.cookie("token", user.token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
      });

      delete user.token;
      delete user.password;

      return user;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "INVALID_CREDENTIALS") {
          throw new UnauthorizedException("INVALID_CREDENTIALS");
        }
      }

      throw error;
    }
  }

  @Patch(":id")
  async changePassword(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() data: ChangePasswordDto
  ) {
    try {
      return await this.authService.changePassword(id, data);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "NOT_MATCH") {
          throw new BadRequestException("Password not match");
        }
      }

      throw error;
    }
  }
}
