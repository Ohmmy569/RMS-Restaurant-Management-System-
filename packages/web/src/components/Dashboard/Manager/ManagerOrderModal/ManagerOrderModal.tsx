import React from "react";
import { Bill, Order } from "@/types/entity";
import {
  Badge,
  Modal,
  Table,
  Center,
  ScrollArea,
  Text,
  Grid,
  Divider,
  Paper,
  Title,
} from "@mantine/core";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order[];
  tableName: string;
  totalPrice: number;
  Bill : Bill;
  tax : number;
  charge : number;
}

export const ManagerOrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  order,
  tableName,
  Bill,
  tax,
  charge,
}) => {
  if (!isOpen) return null;

  const SortOrder = (order: Order[]) => {
    const servedOrders = order.filter((item) => item.status === "SERVED");
    const finishOrders = order.filter((item) => item.status === "FINISHED");
    const pendingOrders = order.filter((item) => item.status === "PENDING");
    const canceledOrders = order.filter((item) => item.status === "CANCELED");

    const mixOrder = [
      ...servedOrders,
      ...finishOrders,
      ...pendingOrders,
      ...canceledOrders,
    ];

    return mixOrder;
  };

  const SortedOrder = SortOrder(order);

  const rowsOrder = SortedOrder.map((item) => {
    let badgeColor = "gray";

    switch (item.status) {
      case "PENDING":
        badgeColor = "green";

        break;
      case "FINISHED":
        badgeColor = "red";

        break;
      case "SERVED":
        badgeColor = "orange";

        break;
      case "CANCELED":
        badgeColor = "gray";

        break;

      default:
        break;
    }

    return (
      <Table.Tr key={item.id} ta="center">
        <Table.Td>{SortedOrder.indexOf(item) + 1}</Table.Td>
        <Table.Td>{item.menu.name}</Table.Td>
        <Table.Td>{item.quantity}</Table.Td>
        <Table.Td>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(item.price)}
        </Table.Td>
        <Table.Td>
          <Badge color={badgeColor} ta="center">
            {item.status}
          </Badge>
        </Table.Td>
      </Table.Tr>
    );
  });

  const head = (
    <Table.Tr>
      <Table.Th ta="center">No.</Table.Th>
      <Table.Th ta="center">Menu Name</Table.Th>
      <Table.Th ta="center">Quantity</Table.Th>
      <Table.Th ta="center">Price</Table.Th>
      <Table.Th ta="center">Status</Table.Th>
      <Table.Th ta="center"></Table.Th>
    </Table.Tr>
  );

  if (rowsOrder.length === 0) {
    return (
      <Modal
        opened={isOpen}
        onClose={onClose}
        title={
          <>
            <span>Order Table : </span>
            <strong>{tableName}</strong>
          </>
        }
        size="70%"
        centered
      >
        <Center py={64} fz={28} c="red" fw={500}>
          No order to show
        </Center>
      </Modal>
    );
  }

  return (
    <Modal
    opened={isOpen}
    onClose={onClose}
    title={
      <>
        <span>Billed Table : </span>
        <strong>{tableName}</strong>
      </>
    }
    size="70%"
    centered
  >
    <Grid mt="sm" align="stretch">
      <Grid.Col span="auto">
        <Table
          stickyHeader
          verticalSpacing="sm"
          highlightOnHover
          withTableBorder
        >
          <ScrollArea
            h={347}
            type="always"
            offsetScrollbars
            scrollbarSize={12}
            scrollHideDelay={3000}
          >
            <Table.Thead>{head}</Table.Thead>
            <Table.Tbody>{rowsOrder}</Table.Tbody>
          </ScrollArea>
        </Table>
      </Grid.Col>
      <Grid.Col span={4}>
        <Paper p="xl" withBorder radius="md">
          <Title order={3} ta="center">
            RMS
          </Title>

          <Text fw={500} size="sm" c="dimmed" ta="center">
            Bill/Payment System
          </Text>
          <Divider size="xs" my="sm" />
          <Grid mt="md">
            <Grid.Col span={6} py={0}>
              <Text size="sm">
                Table : <strong>{tableName}</strong>
              </Text>
            </Grid.Col>
            <Grid.Col span={12} py={0}>
              <Text size="sm">
                Date/Time : <br />
                <strong>{Bill.createdAt}</strong>
              </Text>
            </Grid.Col>
            <Grid.Col span={12} py={0}>
              <Divider size="xs" my="sm" />
            </Grid.Col>
            <Grid.Col span={6} py={0}>
              <Text size="sm">Sub Total :</Text>
            </Grid.Col>

            <Grid.Col span={6} py={0} ta="right">
              {" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Bill.subPrice)}{" "}
            </Grid.Col>
            <Grid.Col span={6} py={2}>
              <Text size="sm">Service Charge :</Text>
            </Grid.Col>
            <Grid.Col span={6} py={2} ta={"right"}>
              <Text size="md">{charge} %</Text>
            </Grid.Col>
            <Grid.Col span={6} py={0}>
              <Text size="sm">Tax :</Text>
            </Grid.Col>
            <Grid.Col span={6} py={0} ta={"right"}>
              <Text size="md">{tax} %</Text>
            </Grid.Col>

            <Grid.Col span={12} py={0}>
              <Divider size="xs" my="sm" />
            </Grid.Col>
            <Grid.Col span={6} py={0}>
              <Text size="sm">Total :</Text>
            </Grid.Col>

            <Grid.Col span={6} py={0}>
              <Title order={3} ta="right">
                {" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(Bill.totalPrice)}{" "}
              </Title>
            </Grid.Col>
          </Grid>
        </Paper>
    
      </Grid.Col>
    </Grid>
  </Modal>
  );
};

export default ManagerOrderModal;
