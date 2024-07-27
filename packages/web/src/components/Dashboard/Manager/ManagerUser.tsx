"use client";

import { AxiosError } from "axios";
import { User } from "@/types/entity";
import { http } from "@/modules/http";
import { modals } from "@mantine/modals";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconSearch } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import {
  IconEdit,
  IconTrash,
  IconSquareRoundedPlus,
} from "@tabler/icons-react";
import {
  Container,
  Group,
  ActionIcon,
  Table,
  Card,
  TextInput,
  Title,
  Tooltip,
  Text,
  rem,
  Center,
} from "@mantine/core";

import React from "react";

import { AddUserModal } from "@/components/Dashboard/Manager/ManagerUserModal/AddUserModal";
import { EditUserModal } from "@/components/Dashboard/Manager/ManagerUserModal/EditUserModal";

export const ManagerUser = () => {
  const [search, setSearch] = useState("");
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [ModalOpenAdd, setModalOpenAdd] = useState(false);
  const [users, setusers] = useState<User[]>([]);
  const [EditUser, setEditUser] = useState<User>({
    id: "",
    username: "",
    password: "",
    name: "",
    role: "",
    email: "",
    telephone: "",
  });

  const { isError, data } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const res = await http.get("/users");

        return res.data as User[];
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
      setusers(data);
    }
  }, [data]);

  if (isError) {
    return (
      <Center py={64} fz={28} c="red" fw={500}>
        Error fetching users
      </Center>
    );
  }

  async function handleSubmitAdd(formDataAdd: User) {
    try {
      const res_add = await http.post("/users", {
        username: formDataAdd.username,
        password: formDataAdd.password,
        name: formDataAdd.name,
        role: formDataAdd.role.toLocaleUpperCase(),
        email: formDataAdd.email,
        telephone: formDataAdd.telephone,
      });
      if (res_add.status === 201) {
        notifications.show({
          title: "Success",
          message: "User added successfully",
          color: "green",
        });
        setModalOpenAdd(false);
        setusers([...users, res_add.data]);
      }
    } catch (e) {
      notifications.show({
        title: "Error",
        message: "Something went wrong. Please try again later",
        color: "red",
      });
    }
  }

  async function handleSubmitEdit(formDataEdit: User) {
    try {
      const res_edit = await http.patch(`/users/${formDataEdit.id}`, {
        username: formDataEdit.username,
        password: formDataEdit.password,
        name: formDataEdit.name,
        role: formDataEdit.role.toLocaleUpperCase(),
        email: formDataEdit.email,
        telephone: formDataEdit.telephone,
      });
      if (res_edit.status === 200) {
        notifications.show({
          title: "Success",
          message: "User edited successfully",
          color: "green",
        });
        setIsModalOpenEdit(false);
        setusers(
          users.map((user) =>
            user.id === formDataEdit.id ? formDataEdit : user
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

  const handleEditclick = (user: User) => {
    setEditUser(user);
    setIsModalOpenEdit(true);
  };

  const remove = (id: string, username: string) => {
    modals.openConfirmModal({
      title: (
        <Text fz={18} fw={750}>
          Delete User
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
          Are you sure you want to delete <strong>{username}</strong> ?
        </Text>
      ),

      onConfirm: async () => {
        try {
          const res_remove = await http.delete(`/users/${id}`);

          if (res_remove.status === 200) {
            notifications.show({
              title: "Success",
              message: "User deleted successfully",
              color: "green",
            });
            setusers(users.filter((user) => user.id !== id));
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

  const filteredRows = users.filter(
    (users) =>
      users.username.toLowerCase().includes(search.toLowerCase()) ||
      users.name.toLowerCase().includes(search.toLowerCase()) ||
      users.role.toLowerCase().includes(search.toLowerCase()) ||
      users.email.toLowerCase().includes(search.toLowerCase()) ||
      users.telephone.toLowerCase().includes(search.toLowerCase())
  );

  const rows = filteredRows.map((users) => (
    <Table.Tr key={users.id} ta="center">
      <Table.Td>{users.username}</Table.Td>
      <Table.Td>{users.name}</Table.Td>
      <Table.Td>{users.role}</Table.Td>
      <Table.Td>{users.email}</Table.Td>
      <Table.Td>{users.telephone}</Table.Td>
      <Table.Td>
        <Tooltip label="Edit">
          <ActionIcon
            radius="md"
            variant="default"
            aria-label="Settings"
            size={32}
            onClick={() => handleEditclick(users)}
            mr="md"
          >
            <IconEdit style={{ width: "80%", height: "80%" }} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon
            radius="md"
            variant="filled"
            aria-label="Delete"
            size={32}
            color="#f03e3e"
            onClick={() => remove(users.id, users.username)}
            disabled={users.role == "MANAGER"}
          >
            <IconTrash style={{ width: "80%", height: "80%" }} />
          </ActionIcon>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  const head = (
    <Table.Tr>
      <Table.Th ta="center">Username</Table.Th>
      <Table.Th ta="center">Name</Table.Th>
      <Table.Th ta="center">Roles</Table.Th>
      <Table.Th ta="center">Email</Table.Th>
      <Table.Th ta="center">Telephone</Table.Th>
    </Table.Tr>
  );

  return (
    <>
      {/*----------------------------------------------------Container Rows--------------------------------------------------------------*/}
      <Container my="md">
        <Group justify="space-between">
          <Title order={3} size="h2" fw={900} ta="center">
            Users
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

      <AddUserModal
        isOpen={ModalOpenAdd}
        onClose={() => setModalOpenAdd(false)}
        onAddUser={handleSubmitAdd}
        userData={data}
      />

      <EditUserModal
        isOpen={isModalOpenEdit}
        onClose={() => setIsModalOpenEdit(false)}
        onEditUser={handleSubmitEdit}
        user={EditUser}
        userData={data}
      />
    </>
  );
};
