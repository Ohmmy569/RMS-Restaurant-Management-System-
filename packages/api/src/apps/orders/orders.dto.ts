import { IsNumber, IsUUID, Max, Min } from "class-validator";

export class CreateOrderDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  quantity: number;

  @IsUUID()
  menuId: string;
}
