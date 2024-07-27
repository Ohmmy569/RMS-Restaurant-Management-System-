import { ChefOrder } from "@/components/Dashboard/Chef/ChefOrder";

export const metadata = {
  title: "Dashboard",
};

export default async function Page() {
  return (
    <div>
      <ChefOrder />
    </div>
  );
}
