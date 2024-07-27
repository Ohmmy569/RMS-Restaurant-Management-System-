"use client";

import { AxiosError } from "axios";
import { http } from "@/modules/http";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { TableEntity } from "@/types/entity";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  IconEdit,
  IconTrash,
  IconSquareRoundedPlus,
  IconSearch,
} from "@tabler/icons-react";
import {
  Container,
  Table,
  ActionIcon,
  TextInput,
  Text,
  Tooltip,
  Badge,
  Card,
  Grid,
  Title,
  rem,
  Center,
  Group,
} from "@mantine/core";

import { AddTableModal } from "@/components/Dashboard/Manager/ManagerTableModal/AddTableModal";
import { EditTableModal } from "@/components/Dashboard/Manager/ManagerTableModal/EditTableModal";

export const ManagerTable = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const [ModalOpenAdd, setModalOpenAdd] = useState(false);
  const [ModalOpenEdit, setModalOpenEdit] = useState(false);

  const [tables, setTables] = useState<TableEntity[]>([]);

  const [search, setSearch] = useState("");

  const [EditTable, setEditTable] = useState<TableEntity>({
    id: "",
    name: "",
    seat: 0,
    status: "",
    passcode: "",
  });

  const { isError, data } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      try {
        const res = await http.get("/tables");

        return res.data as TableEntity[];
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            return [];
          }
        }

        notifications.show({
          title: "Error",
          message: "Something went wrong. Please try again later",
          color: "yellow",
        });
      }
    },
  });

  useEffect(() => {
    if (data !== undefined) {
      setTables(data);
    }
  }, [data]);

  if (isError) {
    return (
      <Center py={64} fz={28} c="red" fw={500}>
        Error fetching users
      </Center>
    );
  }

  async function handleSubmitAdd(formDataAdd: TableEntity) {
    try {
      const res_add = await http.post("/tables", {
        name: formDataAdd.name,
        seat: formDataAdd.seat,
        passcode: formDataAdd.passcode,
      });
      if (res_add.status === 201) {
        notifications.show({
          title: "Success",
          message: "Table added successfully",
          color: "green",
        });
        setModalOpenAdd(false);
        setTables([...tables, res_add.data]);
      }
    } catch (e) {
      notifications.show({
        title: "Error",
        message: "Something went wrong. Please try again later",
        color: "yellow",
      });
    }
  }

  async function handleSubmitEdit(formDataEdit: TableEntity) {
    try {
      const res_edit = await http.patch(`/tables/${formDataEdit.id}`, {
        name: formDataEdit.name,
        seat: formDataEdit.seat,
        passcode: formDataEdit.passcode,
      });
      if (res_edit.status === 200) {
        notifications.show({
          title: "Success",
          message: "Table edited successfully",
          color: "green",
        });
        setModalOpenEdit(false);
        setTables(
          tables.map((table) =>
            table.id === formDataEdit.id ? formDataEdit : table
          )
        );
      }
    } catch (e) {
      notifications.show({
        title: "Error",
        message: "Something went wrong. Please try again later",
        color: "red",
      });
    }
  }

  const handleEditclick = (table: TableEntity) => {
    setEditTable({
      id: table.id,
      name: table.name,
      seat: table.seat,
      status: table.status,
      passcode: "",
    });
    setModalOpenEdit(true);
  };

  const remove = (id: string, name: string) => {
    modals.openConfirmModal({
      title: (
        <Text fz={18} fw={750}>
          Delete Table
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
        <Text>
          Are you sure you want to delete <strong>{name}</strong> ?
        </Text>
      ),

      onConfirm: async () => {
        try {
          const res_remove = await http.delete(`/tables/${id}`);

          if (res_remove.status === 200) {
            notifications.show({
              title: "Success",
              message: "Table deleted successfully",
              color: "green",
            });
            setTables(tables.filter((table) => table.id !== id));
          }
        } catch (e) {
          notifications.show({
            title: "Error",
            message: "Something went wrong. Please try again later",
            color: "red",
          });
        }
      },
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const tablelist = tables.filter(
    (table) =>
      table.status?.toLowerCase().includes(search.toLowerCase()) ||
      table.name.toLowerCase().includes(search.toLowerCase()) ||
      table.seat?.toString().includes(search.toLowerCase())
  );

  const rows = tablelist.map((tablelist) => {
    let badgeColor = "gray";

    switch (tablelist.status) {
      case "IDLE":
        badgeColor = "green";
        break;
      case "EATING":
        badgeColor = "red";
        break;
      default:
        break;
    }

    return (
      <Table.Tr key={tablelist.name} ta="center">
        <Table.Td>{tablelist.name}</Table.Td>

        <Table.Td>
          <Badge color={badgeColor} ta="center">
            {tablelist.status}
          </Badge>
        </Table.Td>

        <Table.Td>{tablelist.seat}</Table.Td>
        <Table.Td>
          <Tooltip label="Edit">
            <ActionIcon
              mr="md"
              variant="default"
              aria-label="Edit"
              size={32}
              onClick={() => handleEditclick(tablelist)}
              radius="md"
            >
              <IconEdit style={{ width: "80%", height: "80%" }} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon
              variant="filled"
              aria-label="Delete"
              size={32}
              onClick={() => remove(tablelist.id, tablelist.name)}
              color="#f03e3e"
              radius="md"
            >
              <IconTrash style={{ width: "80%", height: "80%" }} />
            </ActionIcon>
          </Tooltip>
        </Table.Td>
      </Table.Tr>
    );
  });

  const head = (
    <Table.Tr>
      <Table.Th ta="center">Table number</Table.Th>
      <Table.Th ta="center">Status</Table.Th>
      <Table.Th ta="center">Seat</Table.Th>
      <Table.Th ta="center"></Table.Th>
    </Table.Tr>
  );

  return (
    <>
      <Container my="md">
        <Group justify="space-between">
          <Title order={3} size="h2" fw={900} ta="center">
            Tables
          </Title>
          <ActionIcon
            variant="subtle"
            color="lime.6"
            size="lg"
            radius="xl"
            aria-label="add"
            onClick={() => setModalOpenAdd(true)}
          >
            <IconSquareRoundedPlus stroke={1.5} size={32} />
          </ActionIcon>
        </Group>

        <TextInput
          placeholder="Search for table information..."
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

      <AddTableModal
        isOpen={ModalOpenAdd}
        onClose={() => setModalOpenAdd(false)}
        onAddTable={handleSubmitAdd}
        tableData = {data}
      />

      <EditTableModal
        isOpen={ModalOpenEdit}
        onClose={() => setModalOpenEdit(false)}
        onEditTable={handleSubmitEdit}
        table={EditTable}
        tableData={data}
      />
    </>
  );
};
