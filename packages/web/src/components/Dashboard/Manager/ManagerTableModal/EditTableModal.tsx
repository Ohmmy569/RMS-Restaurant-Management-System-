"use client";
import React, { useEffect } from "react";
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
  NumberInput,
} from "@mantine/core";
import {
  IconUserPlus,
  IconBuildingStore,
  IconLockSquareRounded,
} from "@tabler/icons-react";
import { z } from "zod";
import { useForm } from "@mantine/form";
import { TableEntity } from "@/types/entity";
import { zodResolver } from "mantine-form-zod-resolver";

interface EditTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditTable: (formDataEdit: TableEntity) => void;
  table: TableEntity;
  tableData: TableEntity[] | undefined;
}

export const EditTableModal: React.FC<EditTableModalProps> = ({
  isOpen,
  onClose,
  onEditTable,
  table,
  tableData,
}) => {
  tableData = tableData?.filter((item) => item.id !== table.id);

  const schema = z.object({
    id: z.string(),
    name: z.string().min(1, { message: "Invalid name" }),
    seat: z.number().min(1, { message: "Invalid seat" }),
    status: z.string().min(1, { message: "Invalid status" }),
    passcode: z
      .string()
      .min(6, { message: "Passcode must be 6 number" })
      .max(6, { message: "Passcode must be 6 number" }),
  });

  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      seat: 0,
      status: "",
      passcode: "",
    },

    validate: (values) => {
      const isDuplicateName = tableData?.some(
        (table) => table.name === values.name
      );

      if (isDuplicateName) {
        return { name: "Table name already exists" };
      }
      return zodResolver(schema)(values);
    },
  });

  useEffect(() => {
    form.setValues({
      id: table.id,
      name: table.name,
      seat: table.seat,
      status: table.status,
      passcode: table.passcode,
    });
  }, [table]);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Edit Table"
      size="sm"
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
            onEditTable(data);
            form.reset();
          })();
        }}
      >
        <TextInput
          autoFocus
          label="Table name"
          placeholder="Table name"
          withAsterisk
          mt="sm"
          leftSection={<IconUserPlus size={16} />}
          {...form.getInputProps("name")}
        />
        <NumberInput
          label="Seat"
          placeholder="Seat"
          withAsterisk
          mt="sm"
          leftSection={<IconUserPlus size={16} />}
          {...form.getInputProps("seat")}
          min={0}
          allowDecimal={false}
        />

        <PasswordInput
          autoFocus
          label="Passcode"
          placeholder="Create passcode for table"
          withAsterisk
          mt="sm"
          leftSection={<IconLockSquareRounded size={16} />}
          {...form.getInputProps("passcode")}
        />

        <Select
          label="Status"
          placeholder="Table status"
          mt="sm"
          leftSection={<IconBuildingStore size={16} />}
          data={[
            { value: "IDLE", label: "Idle" },
            { value: "EATING", label: "Eating" },
          ]}
          {...form.getInputProps("status")}
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

export default EditTableModal;
