import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/providers/prisma.service";
import { UsagesService } from "@/apps/usages/usages.service";
import { SettingsService } from "@/apps/settings/settings.service";

@Injectable()
export class BillsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usagesService: UsagesService,
    private readonly settingService: SettingsService
  ) {}
  async findAll() {
    return await this.prisma.billing.findMany({
      include: {
        usage: {
          include: {
            order: {
              include: {
                menu: true,
              },
            },
            table: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.billing.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async createBill(tableId: string) {
    const usage = await this.usagesService.findActive(tableId);

    const bill = await this.prisma.billing.findFirst({
      where: {
        usageId: usage.id,
        status: "UNPAID",
      },
    });

    if (bill) {
      throw new Error("BILL_ALREADY_CREATED");
    }

    const tax = await this.settingService.findByName("BILLING_TAX");
    const charge = await this.settingService.findByName("SERVICE_CHARGE");

    let subTotal = usage.order.reduce((acc, curr) => {
      if (curr.status === "CANCELED") {
        return acc;
      }

      return acc + curr.price * curr.quantity;
    }, 0);

    let totalCharge = (subTotal * Number(charge.value)) / 100;

    let totalTax = (subTotal * Number(tax.value)) / 100;

    let total = subTotal + totalCharge + totalTax;

    return await this.prisma.billing.create({
      data: {
        usageId: usage.id,
        totalPrice: total,
        subPrice: subTotal,
      },
    });
  }

  async confirm(id: string) {
    const bill = await this.findById(id);

    if (bill.status === "CANCELED") {
      throw new Error("BILL_ALREADY_CANCELLED");
    }

    const paid = await this.prisma.billing.update({
      where: {
        id,
      },
      data: {
        status: "PAID",
      },
      include: {
        usage: {
          include: {
            table: true,
          },
        },
      },
    });

    try {
      await this.usagesService.end(paid.usageId);
    } catch (e) {
      throw e;
    }

    return paid;
  }

  async cancel(id: string) {
    const bill = await this.findById(id);

    if (bill.status === "PAID") {
      throw new Error("BILL_ALREADY_CONFIRMED");
    }

    return this.prisma.billing.update({
      where: {
        id,
      },
      data: {
        status: "CANCELED",
      },
    });
  }
}
