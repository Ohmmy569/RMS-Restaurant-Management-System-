"use client";

import cx from "clsx";
import Link from "next/link";
import { User } from "@/types/entity";
import { http } from "@/modules/http";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import classes from "@/styles/dark-mode.module.css";
import { IconMoon, IconSun, IconUserSquareRounded } from "@tabler/icons-react";
import {
  AppShell,
  Button,
  Container,
  Group,
  Menu,
  Text,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

type Props = {
  chef: ReactNode;
  staff: ReactNode;
  manager: ReactNode;
};

const ROLE = ["CHEF", "STAFF", "MANAGER"];

const links = {
  MANAGER: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/dashboard/menus", label: "Menus" },
    { to: "/dashboard/tables", label: "Tables" },
    { to: "/dashboard/users", label: "Users" },
    { to: "/dashboard/history", label: "History" },
    { to: "/dashboard/settings", label: "Settings" },
  ],

  CHEF: [{ to: "/dashboard", label: "Dashboard" }],

  STAFF: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/dashboard/history", label: "History" },
  ],
};

const Base = ({
  user,
  children,
  logout,
}: {
  children: ReactNode;
  user: Pick<User, "role">;
  logout: () => void;
}) => {
  const pathname = usePathname();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const [title, setTitle] = useState("RMS");

  useEffect(() => {
    (async () => {
      try {
        const res = await http.get("/settings/NAME");

        setTitle(res.data.value);
      } catch (e) {
        notifications.show({
          title: "Can't fetch title name",
          message: "An error occurred. Please try again later.",
          color: "red",
        });
      }
    })();
  }, []);

  const selector = (role: string) => {
    switch (role) {
      case "MANAGER":
        return "MANAGER";
      case "CHEF":
        return "CHEF";
      case "STAFF":
        return "STAFF";
      default:
        return "STAFF";
    }
  };

  return (
    <AppShell padding="md" header={{ height: 60 }}>
      <AppShell.Header
        withBorder
        style={{ boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
      >
        <Group h={60} px={32} justify="space-between">
          <Text
            fz={24}
            fw={600}
            component={Link}
            href="/dashboard"
            variant="gradient"
            gradient={{ from: "green.7", to: "lime.5" }}
          >
            {title}
          </Text>

          <Group justify="space-evenly">
            {links[selector(user.role)].map(
              (link: { to: string; label: string }) => (
                <Button
                  key={link.to}
                  component={Link}
                  href={link.to}
                  size="compact-lg"
                  variant="subtle"
                  radius="sm"
                  color={pathname === link.to ? "lime.7" : "gray"}
                >
                  {link.label}
                </Button>
              )
            )}
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
            <Menu>
              <Menu.Target>
                <ActionIcon variant="transparent" size="xl" radius="xl">
                  <IconUserSquareRounded />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item component={Link} href="/dashboard/profile">
                  Profile
                </Menu.Item>
                <Menu.Item onClick={logout} color="red" fw={900}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Container>{children}</Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default function Layout({ chef, staff, manager }: Props) {
  const router = useRouter();
  const { user, removeUser } = useUserStore();

  const logout = () => {
    removeUser();
    router.push("/login");
  };

  useEffect(() => {
    (async () => {
      try {
        await http.get("/auth/check-session");
      } catch (error) {
        removeUser();
        router.push("/login");
      }
    })();
  }, [removeUser, router]);

  if (ROLE.includes(user.role)) {
    return (
      <Base user={user} logout={logout}>
        {user.role === "CHEF" && chef}
        {user.role === "STAFF" && staff}
        {user.role === "MANAGER" && manager}
      </Base>
    );
  }
}
