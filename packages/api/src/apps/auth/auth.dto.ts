import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID, MinLength } from "class-validator";

export class LogInDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class TableLoginDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  passcode: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
