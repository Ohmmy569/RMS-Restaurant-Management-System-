import { Transform } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateMenuDto {
  @MinLength(3)
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  detail: string;

  @Min(1)
  @Max(10000)
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  price: number;
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}
