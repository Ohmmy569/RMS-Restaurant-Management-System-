import { Title, Group } from "@mantine/core";
import { OrdersList } from "@/components/Table/OrdersList";
import { IconToolsKitchen3 } from "@tabler/icons-react";

export const metadata = {
  title: "Order",
};

export default async function Page() {
  return (
    <>
      <Group justify="space-between" mt={32} mb={16}>
        <Title order={3} size="h2" fw={900} ta="center">
          Your Order
        </Title>
        <IconToolsKitchen3 stroke={1.5} size={24} />
      </Group>
      <OrdersList />
    </>
  );
}
