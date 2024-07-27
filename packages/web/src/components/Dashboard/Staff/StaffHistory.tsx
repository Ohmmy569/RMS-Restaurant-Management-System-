"use client";

import { AxiosError } from "axios";
import { Bill, Order } from "@/types/entity";
import { http } from "@/modules/http";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconSearch, IconReceipt } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { BilledOrderModal } from "@/components/Dashboard/Staff/StaffModal/BilledOrderModal";
import {
  Container,
  Group,
  ActionIcon,
  Table,
  Card,
  TextInput,
  Title,
  Tooltip,
  rem,
  Center,
} from "@mantine/core";

import React from "react";
export const StaffHistory = () => {
  const [search, setSearch] = useState("");
  const [ModalOpenView, setModalOpenView] = useState(false);
  const [bill, setbill] = useState<Bill[]>([]);
  const [order, setOrder] = useState<Order[]>([]);
  const [tableName, setTableName] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedBill, setSelectedBill] = useState<Bill>({} as Bill);
  const [tax, setTax] = useState(0);
  const [charge, setCharge] = useState(0);

  const { isError, data } = useQuery({
    queryKey: ["bill"],
    queryFn: async () => {
      try {
        const res = await http.get("/bills");

        return res.data as Bill[];
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
      setbill(data);
    }
  }, [data]);

  if (isError) {
    return (
      <Center py={64} fz={28} c="red" fw={500}>
        Error fetching bill
      </Center>
    );
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredRows = bill.filter(
    (bill) =>
      bill.usage.table.name.toLowerCase().includes(search.toLowerCase()) ||
      bill.createdAt.toLowerCase().includes(search.toLowerCase()) ||
      bill.status.toLowerCase().includes(search.toLowerCase()) ||
      bill.subPrice.toString().includes(search.toLowerCase()) ||
      bill.totalPrice.toString().includes(search.toLowerCase())
  );

  const rows = filteredRows.map((bill) => (
    <Table.Tr key={bill.id} ta="center">
      <Table.Td>{bill.usage.table.name}</Table.Td>
      <Table.Td>{bill.createdAt}</Table.Td>
      <Table.Td>
        {" "}
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(bill.subPrice)}
      </Table.Td>
      <Table.Td>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(bill.totalPrice)}
      </Table.Td>
      <Table.Td>{bill.status}</Table.Td>

      <Table.Td>
        <Tooltip label="Order List">
          <ActionIcon
            radius="md"
            variant="filled"
            aria-label="Order List"
            size={32}
            color="blue.5"
            onClick={() => handleViewclick(bill)}
            mr="md"
          >
            <IconReceipt
              style={{ width: "80%", height: "80%", color: "white" }}
            />
          </ActionIcon>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  const head = (
    <Table.Tr>
      <Table.Th ta="center">Table Name</Table.Th>
      <Table.Th ta="center">Date / Time</Table.Th>
      <Table.Th ta="center">SubTotal Price</Table.Th>
      <Table.Th ta="center">Total Price</Table.Th>
      <Table.Th ta="center">Status</Table.Th>
      <Table.Th ta="center"></Table.Th>
    </Table.Tr>
  );

  const handleViewclick = async (bill: Bill) => {
    try {
      const resTax = await http.get(`/settings/BILLING_TAX`);
      const tax = resTax.data.value;
      const resCharge = await http.get(`/settings/SERVICE_CHARGE`);
      const charge = resCharge.data.value;

      setOrder(bill.usage.order);
      setTableName(bill.usage.table.name);
      setTotalPrice(bill.subPrice);
      setSelectedBill(bill);
      setTax(Number(tax));
      setCharge(Number(charge));

      setModalOpenView(true);
    } catch (error) {}
  };
  return (
    <>
      {/*----------------------------------------------------Container Rows--------------------------------------------------------------*/}
      <Container my="md">
        <Group justify="space-between">
          <Title order={3} size="h2" fw={900} ta="center">
            Bill History
          </Title>
        </Group>
        <TextInput
          placeholder="Search for user information..."
          my="md"
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          value={search}
          onChange={handleSearchChange}
        />
        <Card padding="lg" radius="md" withBorder mt="md">
          <Table stickyHeader verticalSpacing="sm" highlightOnHover>
            <Table.Thead>{head}</Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Card>
      </Container>
      {/*----------------------------------------------------Container Rows--------------------------------------------------------------*/}

      {/* ------------------------------------------------ Modal --------------------------------------------- */}
      <BilledOrderModal
        isOpen={ModalOpenView}
        onClose={() => setModalOpenView(false)}
        order={order}
        tableName={tableName}
        totalPrice={totalPrice}
        Bill={selectedBill}
        tax={tax}
        charge={charge}
      />
    </>
  );
};
