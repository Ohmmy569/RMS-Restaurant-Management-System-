"use client";

import { useEffect, useState } from "react";
import { Menu } from "@/types/entity";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import classes from "@/styles/manager-menus.module.css";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { API_URL } from "@/constants";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { http } from "@/modules/http";
import { AxiosError } from "axios";
import {
  IconEdit,
  IconUpload,
  IconX,
  IconPhotoDown,
  IconSalad,
  IconAlignBoxLeftTop,
  IconSquareRoundedPlus,
  IconTrash, IconCurrencyDollar
} from "@tabler/icons-react";
import {
  Container,
  Group,
  ActionIcon,
  SimpleGrid,
  Card,
  Text,
  Image,
  Button,
  rem,
  TextInput,
  Textarea,
  Tooltip,
  Title,
  NumberInput,
  Modal,
  Box,
} from "@mantine/core";

export const ManagerMenus = () => {
  const [id, setId] = useState("");
  const [menus, setMenus] = useState<Menu[]>([]);

  const form = useForm({
    initialValues: {
      name: "",
      price: 0.0,
      detail: "",
      image: null as File | null,
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await http.get("/menus");
        setMenus(response.data);
      } catch (e) {
        notifications.show({
          title: "Error",
          message: "Failed to fetch menus",
          color: "red",
        });
      }
    })();
  }, []);

  const [search, setSearch] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredRows = menus.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  const addMenuModal = useDisclosure(false);
  const editMenuModal = useDisclosure(false);

  const addMenu = async () => {
    if (form.values.image === null) {
      return notifications.show({
        title: "Image is required",
        message: "Menu image is required",
        color: "red",
      });
    }

    try {
      const formData = new FormData();

      formData.append("name", form.values.name);
      formData.append("price", form.values.price.toString());
      formData.append("detail", form.values.detail);
      form.values.image && formData.append("image", form.values.image);

      const res = await http.post("/menus", formData);

      addMenuModal[1].close();

      setMenus((prev) => [
        ...prev,
        {
          ...res.data,
        },
      ]);

      notifications.show({
        title: "Menu added",
        message: "Menu was successfully added to the list",
        color: "green",
      });
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 409) {
          return notifications.show({
            title: "Duplicate menu name",
            message: "Menu with the same name already exists",
            color: "red",
          });
        }
      }

      notifications.show({
        title: "Error",
        message: "Failed to add menu",
        color: "red",
      });
    }
  };

  const editMenu = async () => {
    try {
      const formData = new FormData();

      form.values.name && formData.append("name", form.values.name);
      form.values.price &&
        formData.append("price", form.values.price.toString());
      form.values.detail && formData.append("detail", form.values.detail);
      form.values.image && formData.append("image", form.values.image);

      const res = await http.patch(`/menus/${id}`, formData);

      editMenuModal[1].close();

      setMenus((prev) => {
        const index = prev.findIndex((food) => food.id === id);

        prev[index] = {
          ...res.data,
        };

        return [...prev];
      });

      notifications.show({
        title: "Updated",
        message: "Menu was successfully updated",
        color: "green",
      });
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 409) {
          return notifications.show({
            title: "Duplicate menu name",
            message: "Menu with the same name already exists",
            color: "red",
          });
        }
      }

      notifications.show({
        title: "Error",
        message: "Failed to update menu",
        color: "red",
      });
    }
  };

  const removeFood = (id: string) => {
    modals.openConfirmModal({
      title: (
        <Text fz={18} fw={750}>
          Delete menu
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
        <Text>Are you sure you want to delete this menu from the list?</Text>
      ),

      onConfirm: async () => {
        try {
          await http.delete(`/menus/${id}`);

          setMenus((prev) => prev.filter((food) => food.id !== id));
        } catch (e) {
          notifications.show({
            title: "Error",
            message: "Failed to delete menu",
            color: "red",
          });
        }

        notifications.show({
          title: "Menu deleted",
          message: "Menu was successfully deleted from the list",
          color: "blue",
        });
      },
    });
  };

  const cards = filteredRows.map((food) => (
    <div key={food.id}>
      <Card padding="lg" radius="xs" className={classes.card} withBorder>
        <Card.Section component="a" withBorder>
          <Tooltip label={food.name} position="top" offset={5}>
            <Image
              src={
                id === food.id && form.values.image
                  ? `${API_URL}/menus/${food.id}/image?${Date.now()}`
                  : `${API_URL}/menus/${food.id}/image`
              }
              height={160}
              width={160}
              alt="Food Image"
            />
          </Tooltip>
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={750} className={classes.colorText}>
            {food.name}
          </Text>
          <Tooltip label="Edit" arrowOffset={30} arrowSize={4} withArrow>
            <ActionIcon
              variant="default"
              aria-label="Settings"
              size={22}
              onClick={() => {
                form.setFieldValue("name", food.name);
                form.setFieldValue("price", food.price);
                form.setFieldValue("detail", food.detail);
                form.setFieldValue("image", null);

                editMenuModal[1].open();
                setId(food.id);
              }}
              radius="md"
            >
              <IconEdit style={{ width: "75%", height: "75%" }} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Group justify="space-between" mb="xs">
          <Text size="sm">
            {
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(food.price)
            }
          </Text>
          <Tooltip label="Delete">
            <ActionIcon
              variant="filled"
              aria-label="Delete"
              size={22}
              color="#f03e3e"
              radius="md"
            >
              <IconTrash
                style={{ width: "80%", height: "80%", color: "white" }}
                onClick={() => removeFood(food.id)}
              />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Text size="sm">{food.detail}</Text>
      </Card>
    </div>
  ));

  return (
    <>
      <Container my="md">
        <Group justify="space-between">
          <Title order={3} size="h2" fw={900} ta="center">
            Menus
          </Title>
          <Tooltip label="Add" position="top" offset={5}>
            <ActionIcon
              variant="subtle"
              color="lime.6"
              size="lg"
              radius="xl"
              aria-label="add"
              onClick={() => {
                form.setFieldValue("name", "");
                form.setFieldValue("price", 0.0);
                form.setFieldValue("detail", "");
                form.setFieldValue("image", null);

                addMenuModal[1].open();
              }}
            >
              <IconSquareRoundedPlus stroke={1.5} size={32} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <TextInput
          placeholder="Search by any field"
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

        <SimpleGrid cols={3} spacing="xl" verticalSpacing="xl" mt="xl">
          {cards}
        </SimpleGrid>
      </Container>

      {/*-------------------------------------------- Modal Edit Menus ------------------------------------------------*/}

      <Modal
        opened={editMenuModal[0]}
        onClose={editMenuModal[1].close}
        title="Edit Menu"
        size="lg"
      >
        <Container>
          {form.values.image ? (
            <Image
              src={URL.createObjectURL(form.values.image)}
              alt="Food Image"
              height={200}
              width={200}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <Dropzone
              onDrop={(files) => form.setFieldValue("image", files[0])}
              onReject={(f) => form.setFieldError("image", "Invalid file")}
              maxSize={5 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
            >
              <Group
                justify="center"
                gap="xl"
                mih={220}
                style={{ pointerEvents: "none" }}
              >
                <Dropzone.Accept>
                  <IconUpload
                    style={{
                      width: rem(52),
                      height: rem(52),
                      color: "var(--mantine-color-blue-6)",
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX
                    style={{
                      width: rem(52),
                      height: rem(52),
                      color: "var(--mantine-color-red-6)",
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhotoDown
                    style={{
                      width: rem(52),
                      height: rem(52),
                      color: "var(--mantine-color-dimmed)",
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Idle>
                <div>
                  <Text size="xl" inline>
                    Pictures
                  </Text>
                </div>
              </Group>
            </Dropzone>
          )}

          <Box component="form" onSubmit={form.onSubmit(() => {})}>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                radius="md"
                label="Food Name"
                placeholder="Name..."
                mt="sm"
                leftSection={<IconSalad size={16} />}
                withAsterisk
                {...form.getInputProps("name")}
              />

              <NumberInput
                label="Prices"
                placeholder="Prices..."
                hideControls
                mt="sm"
                leftSection={<IconCurrencyDollar size={16} />}
                withAsterisk
                {...form.getInputProps("price")}
              />
            </SimpleGrid>

            <Textarea
              resize="vertical"
              radius="md"
              label="Food Detail"
              description="Description"
              placeholder="Detail..."
              mt="sm"
              leftSection={<IconAlignBoxLeftTop size={16} />}
              {...form.getInputProps("detail")}
            />

            <Group justify="center" mt="md">
              <Button
                variant="filled"
                color="green"
                radius="lg"
                mt="sm"
                type="submit"
                onClick={editMenu}
              >
                Save
              </Button>
              <Button
                variant="filled"
                color="red"
                radius="lg"
                mt="sm"
                onClick={editMenuModal[1].close}
              >
                Cancel
              </Button>
            </Group>
          </Box>
        </Container>
      </Modal>

      {/*-------------------------------------------- Modal Add Menus ------------------------------------------------*/}

      <Modal
        opened={addMenuModal[0]}
        onClose={addMenuModal[1].close}
        title="Add Menu"
        size="lg"
      >
        <Container>
          {form.values.image ? (
            <Image
              src={URL.createObjectURL(form.values.image)}
              alt="Food Image"
              height={200}
              width={200}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <Dropzone
              onDrop={(files) => form.setFieldValue("image", files[0])}
              onReject={(f) => form.setFieldError("image", "Invalid file")}
              maxSize={5 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
            >
              <Group
                justify="center"
                gap="xl"
                mih={220}
                style={{ pointerEvents: "none" }}
              >
                <Dropzone.Accept>
                  <IconUpload
                    style={{
                      width: rem(52),
                      height: rem(52),
                      color: "var(--mantine-color-blue-6)",
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX
                    style={{
                      width: rem(52),
                      height: rem(52),
                      color: "var(--mantine-color-red-6)",
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhotoDown
                    style={{
                      width: rem(52),
                      height: rem(52),
                      color: "var(--mantine-color-dimmed)",
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Idle>
                <div>
                  <Text size="xl" inline>
                    Pictures
                  </Text>
                </div>
              </Group>
            </Dropzone>
          )}

          <Box component="form" onSubmit={form.onSubmit(() => {})}>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                radius="md"
                label="Food Name"
                placeholder="Name..."
                mt="sm"
                leftSection={<IconSalad size={16} />}
                withAsterisk
                {...form.getInputProps("name")}
              />

              <NumberInput
                label="Prices"
                placeholder="Prices..."
                hideControls
                mt="sm"
                leftSection={<IconCurrencyDollar size={16} />}
                withAsterisk
                {...form.getInputProps("price")}
              />
            </SimpleGrid>

            <Textarea
              resize="vertical"
              radius="md"
              label="Food Detail"
              description="Description"
              placeholder="Detail..."
              mt="sm"
              leftSection={<IconAlignBoxLeftTop size={16} />}
              {...form.getInputProps("detail")}
            />

            <Group justify="center" mt="md">
              <Button
                variant="filled"
                color="green"
                radius="lg"
                mt="sm"
                type="submit"
                onClick={addMenu}
              >
                Add
              </Button>
              <Button
                variant="filled"
                color="red"
                radius="lg"
                mt="sm"
                onClick={addMenuModal[1].close}
              >
                Cancel
              </Button>
            </Group>
          </Box>
        </Container>
      </Modal>
    </>
  );
};
