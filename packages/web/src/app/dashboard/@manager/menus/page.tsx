import { ManagerMenus } from "@/components/Dashboard/Manager/ManagerMenus";

export const metadata = {
  title: "Manager",
};

export default async function Page() {
  return (
    <div>
      <ManagerMenus />
    </div>
  );
}
