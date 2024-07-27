"use client";

import Link from "next/link";
import { AxiosError } from "axios";
import { http } from "@/modules/http";
import { Order } from "@/types/entity";
import { modals } from "@mantine/modals";
import { useTableStore } from "@/store/table";
import { useQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  Badge,
  Button,
  Card,
  Center,
  Group,
  NumberFormatter,
  Skeleton,
  Stack,
  Table,
  Text,
  ScrollArea,
} from "@mantine/core";
import { useEffect, useState } from "react";

const Total = ({ orders }: { orders: Order[] }) => {
  return (
    <Card>
      <Group justify="space-between">
        <Text fz={26} fw={750}>
          Total Prices :
        </Text>
        <Text c="lime" fz={28} fw={750}>
          <NumberFormatter
            prefix="$ "
            value={orders.reduce((acc, o) => {
              if (o.status !== "CANCELED") {
                return acc + o.price * o.quantity;
              }

              return acc;
            }, 0)}
          />
        </Text>
      </Group>
    </Card>
  );
};

const Empty = () => {
  return (
    <Card padding="xl" withBorder>
      <Center>
        <Stack gap={64}>
          <Text fz={36} fw={400}>
            No orders yet
          </Text>
          <Button
            color="lime"
            variant="outline"
            size="lg"
            component={Link}
            href="/tables/menus"
          >
            Order now
          </Button>
        </Stack>
      </Center>
    </Card>
  );
};

const Fail = () => {
  return (
    <Card padding="xl" withBorder>
      <Center fz={28} c="red" fw={500}>
        Something went wrong. Please try again later
      </Center>
    </Card>
  );
};

const List = ({ orders }: { orders: Order[] }) => {
  const [data, setData] = useState<Order[]>(orders);

  useEffect(() => {
    setData(orders);
  }, [orders]);

  const cancel = (id: string) => {
    modals.openConfirmModal({
      title: (
        <Text fz={18} fw={750}>
          Cancel order
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

      children: (
        <Text fz={16}>
          Are you sure you want to cancel this order? This action cannot be
          undone.
        </Text>
      ),

      onConfirm: async () => {
        try {
          await http.patch(`/orders/cancel/${id}`);

          setData((prev) => {
            return prev.map((o) => {
              if (o.id === id) {
                return {
                  ...o,
                  status: "CANCELED",
                };
              }

              return o;
            });
          });
        } catch (e) {
          notifications.show({
            title: "Error",
            message: "Something went wrong. Please try again later",
            color: "red",
          });
        }

        notifications.show({
          title: "Item removed",
          message: "Item was successfully removed from cart",
          color: "blue",
        });
      },
    });
  };

  return (
    <Card p={0} withBorder>
      <Table
        fz={16}
        verticalSpacing="md"
        horizontalSpacing="lg"
        highlightOnHover
        ta="center"
      >
        <ScrollArea h={400} offsetScrollbars scrollHideDelay={2000}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th ta="center">Name</Table.Th>
              <Table.Th ta="center">Quantity</Table.Th>
              <Table.Th ta="center">Price</Table.Th>
              <Table.Th ta="center">Status</Table.Th>
              <Table.Th ta="center"></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((order) => (
              <Table.Tr key={order.id}>
                <Table.Td>{order.menu.name}</Table.Td>
                <Table.Td>{order.quantity}</Table.Td>
                <Table.Td>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(order.price * order.quantity)}
                </Table.Td>
                <Table.Td>
                  <Badge color={order.status === "CANCELED" ? "red" : "green"}>
                    {order.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {order.status === "PENDING" && (
                    <Button
                      color="red"
                      variant="outline"
                      size="sm"
                      onClick={() => cancel(order.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </ScrollArea>
      </Table>
    </Card>
  );
};

export const OrdersList = () => {
  const { table } = useTableStore();

  const { isPending, isError, data } = useQuery({
    queryKey: ["orders", table.id],
    queryFn: async () => {
      try {
        if (!table.id) return [];

        const response = await http.get(`/usages/active/${table.id}`);

        return response.data.order as Order[];
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

  return (
    <Stack gap={32}>
      {isPending ? (
        <>
          <Skeleton visible={isPending} height={200} />
          <Skeleton visible={isPending} height={100} />
        </>
      ) : isError ? (
        <Fail />
      ) : data?.length === 0 ? (
        <Empty />
      ) : data ? (
        <>
          <List orders={data} />
          <Total orders={data} />
        </>
      ) : null}
    </Stack>
  );
};
