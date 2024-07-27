import { PartialType } from "@nestjs/mapped-types";
import {
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateTableDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  name: string;

  @IsNumber()
  @Min(1)
  @Max(12)
  seat: number;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  passcode: string;
}

export class UpdateTableDto extends PartialType(CreateTableDto) {}
