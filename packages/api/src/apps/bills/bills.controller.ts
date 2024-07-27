import { BillsService } from "@/apps/bills/bills.service";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

@Controller("bills")
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Get()
  async findAll() {
    return await this.billsService.findAll();
  }

  @Get(":id")
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const bill = await this.billsService.findById(id);

    if (!bill) {
      throw new NotFoundException();
    }

    return bill;
  }

  @Post()
  async createBill(@Body("tableId", ParseUUIDPipe) tableId: string) {
    try {
      return await this.billsService.createBill(tableId);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "NO_ACTIVE_USAGE") {
          throw new BadRequestException("No active usage");
        }

        if (e.message === "BILL_ALREADY_CREATED") {
          throw new BadRequestException("Bill already created");
        }
      }

      throw e;
    }
  }

  @Patch("/confirm/:id")
  async confirm(@Param("id", ParseUUIDPipe) id: string) {
    await this.findById(id);

    try {
      return await this.billsService.confirm(id);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "BILL_ALREADY_CANCELLED") {
          throw new BadRequestException("Bill already cancelled");
        }
      }

      throw e;
    }
  }

  @Patch("/cancel/:id")
  async cancel(@Param("id", ParseUUIDPipe) id: string) {
    await this.findById(id);

    try {
      return await this.billsService.cancel(id);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "BILL_ALREADY_CONFIRMED") {
          throw new BadRequestException("Bill already confirmed");
        }
      }

      throw e;
    }
  }
}
