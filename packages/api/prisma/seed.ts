import { hashSync } from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({});
  await prisma.billing.deleteMany({});
  await prisma.menu.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.usage.deleteMany({});
  await prisma.table.deleteMany({});
  await prisma.setting.deleteMany({});

  await prisma.user.createMany({
    data: [
      {
        username: "manager",
        password: hashSync("123456789", 10),
        name: "John Doe",
        role: "MANAGER",
        email: "john.doe@gmail.com",
        telephone: "0800000000",
      },
    ],
  });

  await prisma.setting.createMany({
    data: [
      {
        name: "NAME",
        value: "RMS",
        type: "STRING",
      },
      {
        name: "BILLING_TAX",
        value: "10",
        type: "NUMBER",
      },
      {
        name: "SERVICE_CHARGE",
        value: "10",
        type: "NUMBER",
      },
    ],
  });
}

main();
