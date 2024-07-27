
import { Order, Bill } from "@/types/entity";
import {
  Modal,
  Table,
  Grid,
  Paper,
  Text,
  Button,
  Title,
  Group,
  Center,
  ScrollArea,
  Divider,
} from "@mantine/core";
import "@mantine/notifications/styles.css";

interface BillModalProps {
  isOpen: boolean;
  CancelBill: (id: string) => void;
  ConfirmBill: (billId: string, tableId: string) => void;
  onClose: () => void;
  ServedOrder: Order[];
  tableName: string;
  billID: string;
  tableID: string;
  Bill: Bill;
  tax : number;
  charge : number;
}

export const BillModal: React.FC<BillModalProps> = ({
  isOpen,
  CancelBill,
  ConfirmBill,
  onClose,
  ServedOrder,
  tableName,
  billID,
  tableID,
  Bill,
  tax,
  charge
}) => {
  if (!isOpen) return null;

  const headbilled = (
    <Table.Tr>
      <Table.Th ta="center">No.</Table.Th>
      <Table.Th ta="center">Menu</Table.Th>
      <Table.Th ta="center">Price</Table.Th>
      <Table.Th ta="center">quantity</Table.Th>
    </Table.Tr>
  );

  const rowsbilled = ServedOrder.map((bill) => (
    <Table.Tr key={bill.id} ta="center">
      <Table.Td>{ServedOrder.indexOf(bill) + 1}</Table.Td>
      <Table.Td>{bill.menu.name}</Table.Td>
      <Table.Td>{bill.price}</Table.Td>
      <Table.Td>{bill.quantity}</Table.Td>
    </Table.Tr>
  ));

  if (rowsbilled.length === 0) {
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
        <Center py={64} fz={28} c="red" fw={500}>
          No order to billed
        </Center>
      </Modal>
    );
  }

  return (
    <Modal
      opened={isOpen}
      onClose={() => CancelBill(billID)}
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
              <Table.Thead>{headbilled}</Table.Thead>
              <Table.Tbody>{rowsbilled}</Table.Tbody>
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
          <Group justify="center" gap="xl" grow>
            <Button
              variant="filled"
              color="teal"
              radius="md"
              mt="md"
              onClick={() => ConfirmBill(billID, tableID)}
            >
              Confirm
            </Button>
            <Button
              variant="filled"
              color="red"
              radius="md"
              mt="sm"
              onClick={() => CancelBill(billID)}
            >
              Cancel
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
    </Modal>
  );
};

export default BillModal;
