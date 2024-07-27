"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { http } from "@/modules/http";
import { TableEntity } from "@/types/entity";
import { useRouter } from "next/navigation";
import { useTableStore } from "@/store/table";
import { notifications } from "@mantine/notifications";
import {
  Button,
  Grid,
  PinInput,
  Stack,
  Title,
  MantineProvider,
  Anchor,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import classes from "@/styles/tables.module.css";
import Link from "next/link";

export const TableSelector = () => {
  const router = useRouter();
  const { setTable } = useTableStore();
  const [tables, setTables] = useState<Omit<TableEntity, "passcode">[]>([]);
  const [passcode, setPasscode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<Omit<
    TableEntity,
    "passcode"
  > | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get("/tables");

        setTables(data);
      } catch (error) {
        notifications.show({
          title: "Something went wrong",
          message: "Please try again",
          color: "red",
        });
      }
    })();
  }, []);

  const connect = async () => {
    setLoading(true);

    if (!selected) {
      notifications.show({
        title: "Table is required",
        message: "Please select a table",
        color: "red",
      });

      return setLoading(false);
    }

    if (!passcode || passcode.length < 6) {
      notifications.show({
        title: "Passcode is required",
        message: "Please enter passcode",
        color: "red",
      });

      return setLoading(false);
    }

    try {
      await http.post("/auth/table-login", {
        id: selected.id,
        passcode,
      });

      setLoading(false);
      setTable({ id: selected.id, name: selected.name });

      router.push("/tables/menus");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          notifications.show({
            title: "Invalid passcode",
            message: "Please try again",
            color: "red",
          });

          return setLoading(false);
        }
      }

      notifications.show({
        title: "Something went wrong",
        message: "Please try again",
        color: "red",
      });

      return setLoading(false);
    }
  };

  return (
    <Stack py={64} maw={420} gap={32} align="center">
      <Title order={1} fz={32} fw={600}>
        Table Selector
      </Title>
      <Grid gutter={64}>
        {tables.map((table) => (
          <Grid.Col span={4} key={table.id}>
            <MantineProvider theme={{ focusClassName: classes.focus }}>
              <Button
                size="xl"
                key={table.id}
                onClick={() => setSelected(table)}
                color={selected === table ? "blue.5" : "dark.5"}
              >
                {table.name}
              </Button>
            </MantineProvider>
          </Grid.Col>
        ))}
      </Grid>
      <PinInput length={6} mask size="xl" onComplete={(v) => setPasscode(v)} />
      <Button
        loading={loading}
        onClick={connect}
        size="xl"
        fullWidth
        rightSection={<IconChevronRight size={26} />}
        leftSection={<span />}
        justify="space-between"
      >
        Connect
      </Button>
      <Anchor
        component={Link}
        href="/login"
        mt={16}
        py={16}
        fz={18}
        fw={500}
        ta="center"
      >
        Switch to management system
      </Anchor>
    </Stack>
  );
};
