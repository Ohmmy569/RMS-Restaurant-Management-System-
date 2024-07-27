import { PartialType } from "@nestjs/mapped-types";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  readonly username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  readonly password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(10)
  @MaxLength(10)
  readonly telephone: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
