"use client";

import { http } from "@/modules/http";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user";
import { notifications } from "@mantine/notifications";
import {
  Button,
  TextInput,
  PasswordInput,
  Card,
  Stack,
  Text,
  Anchor,
} from "@mantine/core";
import { AxiosError } from "axios";
import Link from "next/link";

export const Login = () => {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.id) {
      router.push("/dashboard");
    }
  }, [router, user]);

  const login = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await http.post("/auth/login", {
        username,
        password,
      });

      setUser({
        id: res.data.id,
        username: res.data.username,
        role: res.data.role,
      });
      setLoading(false);

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          notifications.show({
            title: "Error",
            message: "Invalid username or password",
            color: "red",
          });

          return setLoading(false);
        }
      }

      notifications.show({
        title: "Error",
        message: "An error occurred. Please try again later.",
        color: "red",
      });

      setLoading(false);
    }
  };

  return (
    <>
      <Card shadow="sm" radius="md" w={700} withBorder>
        <form onSubmit={login} autoComplete="on" method="POST">
          <Stack>
            <Text fz={60} fw={600} ta="center">
              Login
            </Text>
            <TextInput
              name="username"
              size="lg"
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.currentTarget.value);
              }}
            />
            <PasswordInput
              name="password"
              size="lg"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.currentTarget.value);
              }}
            />
            <Button
              onClick={login}
              loading={loading}
              type="submit"
              variant="filled"
              size="lg"
              fullWidth
            >
              Login
            </Button>
          </Stack>
        </form>
        <Anchor
          component={Link}
          href="/tables"
          mt={16}
          py={16}
          fz={18}
          fw={500}
          ta="center"
        >
          Switch to table system
        </Anchor>
      </Card>
    </>
  );
};
