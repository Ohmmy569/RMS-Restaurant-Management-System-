"use client";
import React from "react";
import {
  Modal,
  Group,
  Avatar,
  SimpleGrid,
  TextInput,
  Select,
  PasswordInput,
  Flex,
  Button,
} from "@mantine/core";
import {
  IconUserPlus,
  IconBuildingStore,
  IconPhone,
  IconAt,
  IconLockSquareRounded,
} from "@tabler/icons-react";
import { z } from "zod";
import { useForm } from "@mantine/form";
import { User } from "@/types/entity";
import { zodResolver } from "mantine-form-zod-resolver";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (formDataAdd: User) => void;
  userData: User[] | undefined;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onAddUser,
  userData,
}) => {
  const schema = z.object({
    id: z.string(),
    username: z.string().min(4, { message: "Username is too short" }),
    name: z.string().min(3, { message: "Name is too short" }),
    password: z.string().min(8, { message: "Password is too short" }),
    role: z
      .string()
      .refine(
        (value) =>
          ["MANAGER", "CHEF", "STAFF"].includes(value.toLocaleUpperCase()),
        {
          message: "Invalid role",
        }
      ),
    email: z.string().email({ message: "Invalid email" }),
    telephone: z.string().refine((value) => value.length === 10, {
      message: "Invalid phone number",
    }),
  });

  const form = useForm({
    initialValues: {
      id: "",
      username: "",
      name: "",
      password: "",
      role: "",
      email: "",
      telephone: "",
    },

    validate: (values) => {
      const isDuplicateUsername = userData?.some(
        (user) => user.username === values.username
      );

      if (isDuplicateUsername) {
        return { username: "Username already exists" };
      }
      return zodResolver(schema)(values);
    },
  });

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Add Users"
      styles={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Group justify="center">
        <Avatar
          variant="light"
          radius="xl"
          size="xl"
          src=""
          alt="no image here"
          mt="sm"
        />
      </Group>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.onSubmit((data) => {
            onAddUser(data);
            form.reset();
          })();
        }}
      >
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <TextInput
            autoFocus
            label="Username"
            placeholder="Username"
            withAsterisk
            mt="sm"
            leftSection={<IconUserPlus size={16} />}
            {...form.getInputProps("username")}
          />
          <TextInput
            label="Name"
            placeholder="Name"
            withAsterisk
            mt="sm"
            leftSection={<IconUserPlus size={16} />}
            {...form.getInputProps("name")}
          />
        </SimpleGrid>

        <Select
          label="Role"
          placeholder="Pick role"
          mt="sm"
          leftSection={<IconBuildingStore size={16} />}
          data={[
            { value: "MANAGER", label: "Manager" },
            { value: "CHEF", label: "Chef" },
            { value: "STAFF", label: "Staff" },
          ]}
          {...form.getInputProps("role")}
        />
        <TextInput
          label="Telephone"
          placeholder="Telephone"
          withAsterisk
          mt="sm"
          leftSection={<IconPhone size={16} />}
          {...form.getInputProps("telephone")}
        />

        <TextInput
          label="Email"
          placeholder="Email"
          withAsterisk
          mt="sm"
          leftSection={<IconAt size={16} />}
          {...form.getInputProps("email")}
        />
        <PasswordInput
          autoFocus
          label="Password"
          placeholder="Password"
          withAsterisk
          mt="sm"
          leftSection={<IconLockSquareRounded size={16} />}
          {...form.getInputProps("password")}
        />

        <Flex
          mih={50}
          mt="md"
          gap="xl"
          justify="center"
          align="flex-start"
          direction="row"
          wrap="wrap"
        >
          <Button
            type="submit"
            variant="filled"
            radius="lg"
            mt="sm"
            color="green"
          >
            Add
          </Button>
          <Button
            variant="filled"
            radius="lg"
            mt="sm"
            color="red"
            onClick={onClose}
          >
            Cancel
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};

export default AddUserModal;
