"use client";
import { useEffect } from "react";
import {
  Modal,
  Group,
  Avatar,
  SimpleGrid,
  TextInput,
  Select,
  Flex,
  Button,
} from "@mantine/core";
import {
  IconBuildingStore,
  IconPhone,
  IconAt,
  IconUserEdit,
} from "@tabler/icons-react";
import { z } from "zod";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { User } from "@/types/entity";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditUser: (formDataEdit: User) => void;
  user: User;
  userData: User[] | undefined;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onEditUser,
  user,
  userData,
}) => {
  userData = userData?.filter((item) => item.id !== user.id);

  const schema = z.object({
    id: z.string(),
    username: z.string().min(4, { message: "Username is too short" }),
    name: z.string().min(3, { message: "Name is too short" }),
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

  useEffect(() => {
    form.setValues({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email,
      telephone: user.telephone,
    });
  }, [user]);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Edit Users"
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
            onEditUser(data);
            form.reset();
          })();
        }}
      >
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <TextInput
            label="Username"
            placeholder="Username"
            withAsterisk
            mt="sm"
            leftSection={<IconUserEdit size={16} />}
            {...form.getInputProps("username")}
          />
          <TextInput
            label="Name"
            placeholder="Name"
            withAsterisk
            mt="sm"
            leftSection={<IconUserEdit size={16} />}
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
            Save
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

export default EditUserModal;
