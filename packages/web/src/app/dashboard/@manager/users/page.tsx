import { ManagerUser } from "@/components/Dashboard/Manager/ManagerUser";

export const metadata = {
  title: "Manager",
};

export default async function Page() {
  return (
    <div>
      <ManagerUser />
    </div>
  );
}
