import { ManagerHistory } from "@/components/Dashboard/Manager/ManagerHistory";
export const metadata = {
  title: "Manager",
};

export default async function Page() {
  return (
    <div>
      <ManagerHistory />
    </div>
  );
}
