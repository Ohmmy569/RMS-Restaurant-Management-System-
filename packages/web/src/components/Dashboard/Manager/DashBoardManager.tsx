"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  ThemeIcon,
  Text,
  Group,
  Badge,
  Paper,
  Center,
  ActionIcon,
  SimpleGrid,
} from "@mantine/core";
import {
  IconUsers,
  IconDesk,
  IconNotes,
  IconChevronRight,
} from "@tabler/icons-react";
import classes from "@/styles/dashboard.module.css";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/modules/http";
import { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import Link from "next/link";

export const DashBoardManager = () => {
  const [countData, setcountData] = useState<number[]>([]);

  const { isError, data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      try {
        const resUser = await http.get("/users/count");
        const resMenu = await http.get("menus/count");
        const resTable = await http.get("/tables/count");

        const data: number[] = [resUser.data, resMenu.data, resTable.data];

        return data;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            return [];
          }
        }

        notifications.show({
          title: "Error",
          message: "Something went wrong. Please try again later",
          color: "red",
        });
      }
    },
  });

  useEffect(() => {
    if (data !== undefined) {
      setcountData(data);
    }
  }, [data, countData]);

  if (isError) {
    return (
      <Center py={64} fz={28} c="red" fw={500}>
        Error fetching Dashboard
      </Center>
    );
  }

  return (
    <Container>
      <Grid>
        <Grid.Col span={6}>
          <Paper
            radius="md"
            withBorder
            className={classes.card}
            mt={20}
            p="md"
            component={Link}
            href="/dashboard/users"
          >
            <Grid>
              <Grid.Col span={{ base: 12, xs: 3 }}>
                <ThemeIcon color="blue.6" size={64} radius="xl">
                  <IconUsers size={32} stroke={2} />
                </ThemeIcon>
              </Grid.Col>

              <Grid.Col span={{ base: 12, xs: 8 }}>
                <Group justify="space-between">
                  <Text fz={28} fw={750} c="black">
                    {countData[0]}
                  </Text>
                  <ActionIcon variant="transparent">
                    <IconChevronRight size="1.7rem" stroke={2} />
                  </ActionIcon>
                </Group>
                <Group justify="space-between">
                  <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                    User
                  </Text>
                  <Badge size="md" color="green.7">
                    Now
                  </Badge>
                </Group>
              </Grid.Col>
            </Grid>
          </Paper>
        </Grid.Col>

        <Grid.Col span={6}>
          <Paper
            radius="md"
            withBorder
            className={classes.card}
            mt={20}
            p="md"
            component={Link}
            href="/dashboard/menus"
          >
            <Grid>
              <Grid.Col span={{ base: 12, xs: 3 }}>
                <ThemeIcon color="indigo.6" size={64} radius="xl">
                  <IconNotes size={32} stroke={2} />
                </ThemeIcon>
              </Grid.Col>

              <Grid.Col span={{ base: 12, xs: 8 }}>
                <Group justify="space-between">
                  <Text fz={28} fw={750} c="black">
                    {countData[1]}
                  </Text>
                  <ActionIcon variant="transparent">
                    <IconChevronRight size="1.7rem" stroke={2} />
                  </ActionIcon>
                </Group>
                <Group justify="space-between">
                  <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                    Menus
                  </Text>
                  <Badge size="md" color="green.7">
                    Now
                  </Badge>
                </Group>
              </Grid.Col>
            </Grid>
          </Paper>
        </Grid.Col>

        <Grid.Col span={6}>
          <Paper
            radius="md"
            withBorder
            className={classes.card}
            mt={20}
            p="md"
            component={Link}
            href="/dashboard/tables"
          >
            <Grid>
              <Grid.Col span={{ base: 12, xs: 3 }}>
                <ThemeIcon color="violet.6" size={64} radius="xl">
                  <IconDesk size={32} stroke={1.5} />
                </ThemeIcon>
              </Grid.Col>

              <Grid.Col span={{ base: 12, xs: 8 }}>
                <Group justify="space-between">
                  <Text fz={28} fw={750} c="black">
                    {countData[2]}
                  </Text>
                  <ActionIcon variant="transparent">
                    <IconChevronRight size="1.7rem" stroke={2} />
                  </ActionIcon>
                </Group>
                <Group justify="space-between">
                  <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                    Tables
                  </Text>
                  <Badge size="md" color="green.7">
                    Now
                  </Badge>
                </Group>
              </Grid.Col>
            </Grid>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};
