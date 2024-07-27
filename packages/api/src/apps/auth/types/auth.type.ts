import { UserRole } from "@prisma/client";

export type CurrentClient = {
  id: string;
  role: UserRole | "TABLE";
};
