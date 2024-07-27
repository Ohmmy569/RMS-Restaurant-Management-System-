"use client";

import Link from "next/link";
import cx from "clsx";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { CartList } from "@/components/Table/CartList";
import { IconShoppingCart, IconSun, IconMoon } from "@tabler/icons-react";
import {
  ActionIcon,
  AppShell,
  Button,
  CloseButton,
  Container,
  Group,
  Text,
  Title,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import classes from "@/styles/dark-mode.module.css";
import { useTableStore } from "@/store/table";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const pathname = usePathname();
  const [opened, handlers] = useDisclosure();
  const { table } = useTableStore();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <AppShell
      aside={{
        collapsed: {
          mobile: !opened,
          desktop: !opened,
        },
        width: 800,
        breakpoint: "md",
      }}
      padding="md"
      header={{ height: 70 }}
    >
      <AppShell.Header
        withBorder
        style={{ boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
      >
        <Group h={80} px={32} justify="space-between">
          <Text
            fz={24}
            fw={600}
            variant="gradient"
            gradient={{ from: "green.7", to: "lime.5" }}
          >
            RMS
          </Text>
          <Group justify="space-evenly">
            <Button
              component={Link}
              href="/tables"
              size="compact-lg"
              variant="subtle"
              color={pathname === "/tables" ? "lime" : "gray"}
            >
              Tables
            </Button>
            <Button
              component={Link}
              href="/tables/menus"
              size="compact-lg"
              variant="subtle"
              color={pathname === "/tables/menus" ? "lime" : "gray"}
            >
              Menus
            </Button>
            <Button
              component={Link}
              href="/tables/orders"
              size="compact-lg"
              variant="subtle"
              color={pathname === "/tables/orders" ? "lime" : "gray"}
            >
              Orders
            </Button>
          </Group>
          <Group>
            <ActionIcon
              variant="transparent"
              size="xl"
              radius="xl"
              aria-label="Toggle color scheme"
              onClick={() =>
                setColorScheme(
                  computedColorScheme === "light" ? "dark" : "light"
                )
              }
            >
              <IconSun className={cx(classes.icon, classes.light)} />
              <IconMoon className={cx(classes.icon, classes.dark)} />
            </ActionIcon>
            <ActionIcon onClick={handlers.toggle} size="lg">
              <IconShoppingCart />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Aside p={32}>
        <Group justify="space-between">
          <Text fz={28} fw={500}>
            Carts
          </Text>
          <CloseButton size="lg" onClick={handlers.close} />
        </Group>
        <CartList />
      </AppShell.Aside>
      <AppShell.Main>
        <Container>{children}</Container>
      </AppShell.Main>
    </AppShell>
  );
}
