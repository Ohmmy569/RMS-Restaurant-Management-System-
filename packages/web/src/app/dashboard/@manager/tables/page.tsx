import { ManagerTable } from "@/components/Dashboard/Manager/ManagerTable";

export const metadata = {
  title: "Manager",
};

export default async function Page() {
  return (
    <div>
      <ManagerTable />
    </div>
  );
}
