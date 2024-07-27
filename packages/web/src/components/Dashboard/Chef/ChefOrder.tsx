"use client";

import { http } from "@/modules/http";
import { Order } from "@/types/entity";
import { modals } from "@mantine/modals";
import { IconX, IconCheck, IconChefHat } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import {
  Badge,
  Card,
  Center,
  Container,
  Table,
  Text,
  ActionIcon,
  Tooltip,
  Title,
  Group,
} from "@mantine/core";
import { useState, useEffect } from "react";

export const ChefOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const { isError, data } = useQuery({
    queryKey: ["orders", "PENDING"],
    queryFn: async () => {
      try {
        const res = await http.get("/orders/status/PENDING");

        return res.data as Order[];
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
      setOrders(data);
    }
  }, [data]);

  if (isError) {
    return (
      <Center py={64} fz={28} c="red" fw={500}>
        Error fetching orders
      </Center>
    );
  }

  if (data === undefined) {
    return (
      <Center py={64} fz={28} c="red" fw={500}>
        Loading...
      </Center>
    );
  }

  const finish = async (id: string) => {
    const res = await http.patch(`/orders/finish/${id}`);
    if (res.status === 200) {
      notifications.show({
        title: "Success",
        message: "Order finished successfully",
        color: "green",
      });

      setOrders(orders.filter((order) => order.id !== id));
    }
  };

  const cancel = (id: string) => {
    modals.openConfirmModal({
      title: (
        <Text fz={18} fw={750}>
          Cancel Order
        </Text>
      ),

      centered: true,

      labels: {
        confirm: "Confirm",
        cancel: "Cancel",
      },

      confirmProps: {
        color: "red",
      },

      children: <Text>Are you sure you want to cancel this order?</Text>,

      onConfirm: async () => {
        const res = await http.patch(`/orders/cancel/${id}`);
        if (res.status === 200) {
          notifications.show({
            title: "Success",
            message: "Order cancelled successfully",
            color: "green",
          });

          setOrders(orders.filter((order) => order.id !== id));
        }
      },
    });
  };

  const row = orders.map((order) => (
    <Table.Tr key={order.id} ta="center">
      <Table.Td>{order.menu.name}</Table.Td>
      <Table.Td>{order.quantity}</Table.Td>
      <Table.Td>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(order.price)}
      </Table.Td>
      <Table.Td>{order.usage.table.name}</Table.Td>
      <Table.Td>{order.createdAt}</Table.Td>
      <Table.Td>
        <Badge>{order.status}</Badge>
      </Table.Td>
      <Table.Td>
        <Tooltip label="Finish">
          <ActionIcon
            radius="sm"
            color="green"
            title="Finish"
            onClick={() => finish(order.id)}
          >
            <IconCheck />
          </ActionIcon>
        </Tooltip>
        &nbsp;
        <Tooltip label="Cancel">
          <ActionIcon
            radius="sm"
            color="red"
            title="Cancel"
            onClick={() => cancel(order.id)}
          >
            <IconX />
          </ActionIcon>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  const head = (
    <Table.Tr>
      <Table.Th ta="center">Menu</Table.Th>
      <Table.Th ta="center">Quantity</Table.Th>
      <Table.Th ta="center">Price</Table.Th>
      <Table.Th ta="center">Table</Table.Th>
      <Table.Th ta="center">Date/Time</Table.Th>
      <Table.Th ta="center">Status</Table.Th>
      <Table.Th ta="center"></Table.Th>
    </Table.Tr>
  );

  return (
    <Container>
      <Group justify="space-between" my="md">
        <Title order={3} size="h2" fw={900} ta="center">
          Chef
        </Title>
        <IconChefHat stroke={1.5} size={32} />
      </Group>

      <Card padding="md" radius="md" withBorder mt="sm">
        <Table stickyHeader highlightOnHover verticalSpacing="sm">
          <Table.Thead>{head}</Table.Thead>
          <Table.Tbody>{row}</Table.Tbody>
        </Table>
      </Card>
    </Container>
  );
};
