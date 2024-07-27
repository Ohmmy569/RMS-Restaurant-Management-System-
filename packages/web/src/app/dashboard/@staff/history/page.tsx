import { StaffHistory } from "@/components/Dashboard/Staff/StaffHistory";
export const metadata = {
  title: "Manager",
};

export default async function Page() {
  return (
    <div>
      <StaffHistory />
    </div>
  );
}
