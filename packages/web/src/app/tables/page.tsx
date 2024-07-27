import { Center, Stack } from "@mantine/core";
import { TableSelector } from "@/components/Table/TableSelector";

export const metadata = {
  title: "Table Selector",
};

export default async function Page() {
  return (
    <>
      <Center>
        <Stack align="center">
          <TableSelector />
        </Stack>
      </Center>
    </>
  );
}
