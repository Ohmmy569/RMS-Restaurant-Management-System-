import { Title, Group } from "@mantine/core";
import { MenusList } from "@/components/Table/MenusList";

export const metadata = {
  title: "Menu",
};

export default async function Page() {
  return (
    <>
      <Group justify="center" mt={32} mb={16}>
        <Title order={3} size="h2" fw={900} ta="center">
          Menus
        </Title>
      </Group>
      <MenusList />
    </>
  );
}
