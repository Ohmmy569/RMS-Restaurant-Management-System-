"use client";

import { API_URL } from "@/constants";
import { useEffect, useState } from "react";
import { Cart, Menu } from "@/types/entity";
import { useCartsStore } from "@/store/carts";
import { IconShoppingCartPlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import {
  Grid,
  GridCol,
  Card,
  CardSection,
  Group,
  Badge,
  Button,
  Image,
  Text,
  NumberInput,
  Flex,
  Tooltip,
} from "@mantine/core";
import { http } from "@/modules/http";
import classes from "@/styles/manager-menus.module.css";

export const MenusList = () => {
  const carts = useCartsStore();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [quantitys, setQuantitys] = useState<Map<string, number>>(new Map());

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

  const add = (item: Cart) => {
    carts.add(item);

    notifications.show({
      title: "Added to cart",
      message: `${item.quantity}x ${item.name} added to cart`,
      color: "teal",
    });
  };

  return (
    <Grid gutter={16}>
      {menus.map((menu) => (
        <GridCol span={{ base: 12, sm: 4 }} key={menu.id}>
          <Card padding="lg" radius="xs" className={classes.card} withBorder>
            <CardSection>
              <Tooltip label={menu.name}>
                <Image
                  src={`${API_URL}/menus/${menu.id}/image`}
                  height={160}
                  alt={menu.name}
                />
              </Tooltip>
            </CardSection>
            <Group justify="space-between" mt="md" >
              <Text fz={18} fw={750}>
                {menu.name}
              </Text>
              <Badge
                size="lg"
                variant="light"
                c="green.8"
                color="green.8"
                fw={750}
              >
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(menu.price)}
              </Badge>
            </Group>
            <Group my="xs" >
              <Text
              size="sm"
              >{menu.detail}</Text>
            </Group>
            <Flex gap={8} align="center" justify="space-between">
              <NumberInput
                defaultValue={1}
                min={1}
                max={10}
                onChange={(value) => {
                  setQuantitys((prev) =>
                    new Map(prev).set(menu.id, Number(value))
                  );
                }}
              />
              <Button
                leftSection={<IconShoppingCartPlus size={18} />}
                fullWidth
                variant="gradient"
                gradient={{ from: "green", to: "lime", deg: 270 }}
                onClick={() =>
                  add({
                    id: new Date().getTime().toString(),
                    name: menu.name,
                    price: menu.price * (quantitys.get(menu.id) || 1),
                    quantity: quantitys.get(menu.id) || 1,
                    menuId: menu.id,
                  })
                }
              >
                Add to cart
              </Button>
            </Flex>
          </Card>
        </GridCol>
      ))}
    </Grid>
  );
};
