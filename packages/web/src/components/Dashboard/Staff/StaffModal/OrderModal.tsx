import React from "react";
import { Order } from "@/types/entity";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  Badge,
  Card,
  Modal,
  Table,
  ActionIcon,
  Tooltip,
  Center,
  ScrollArea,
} from "@mantine/core";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  markAsServed: (id: string) => void;
  tableName: string;
  order: Order[];
  cancelOrder: (id: string) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  markAsServed,
  order,
  tableName,
  cancelOrder,
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
        <Table.Td>{item.createdAt}</Table.Td>
        <Table.Td>
          <Badge color={badgeColor} ta="center">
            {item.status}
          </Badge>
        </Table.Td>
        <Table.Td>
          {item.status === "FINISHED" ? ( // Conditionally render ActionIcon
            <Tooltip label="Mark order as served" position="top" offset={5}>
              <ActionIcon radius="md" onClick={() => markAsServed(item.id)}>
                <IconCheck />
              </ActionIcon>
            </Tooltip>
          ) : (
            " "
          )}
          &nbsp;
          {item.status === "FINISHED" ? ( // Conditionally render ActionIcon
            <Tooltip label="Cancel order" position="top" offset={5}>
              <ActionIcon
                radius="md"
                onClick={() => cancelOrder(item.id)}
                color="red"
              >
                <IconX />
              </ActionIcon>
            </Tooltip>
          ) : (
            " "
          )}
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
      <Table.Th ta="center">Date / Time</Table.Th>
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
          <span>Order Table : </span>
          <strong>{tableName}</strong>
        </>
      }
      size="70%"
      centered
    >
      <Card shadow="md" padding="lg" radius="md" withBorder>
        <Table stickyHeader verticalSpacing="sm" highlightOnHover>
          <ScrollArea
            h={400}
            type="always"
            offsetScrollbars
            scrollbarSize={12}
            scrollHideDelay={3000}
          >
            <Table.Thead>{head}</Table.Thead>
            <Table.Tbody>{rowsOrder}</Table.Tbody>
          </ScrollArea>
        </Table>
      </Card>
    </Modal>
  );
};

export default OrderModal;
