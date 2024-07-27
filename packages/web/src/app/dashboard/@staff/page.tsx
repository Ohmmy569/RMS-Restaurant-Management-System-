import { TableStaff } from "@/components/Dashboard/Staff/StaffTable";

export const metadata = {
  title: "Dashboard",
};

export default async function Page() {
  return <TableStaff />;
}
