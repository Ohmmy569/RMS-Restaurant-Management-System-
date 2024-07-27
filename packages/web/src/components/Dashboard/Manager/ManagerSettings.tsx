"use client";

import { http } from "@/modules/http";
import { useEffect, useState } from "react";
import {
  Card,
  NumberInput,
  Table,
  TextInput,
  Title,
  Group,
  Box,
  Button,
} from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";



export function ManagerSettings() {

  type setting = {
    id: string;
    name: string;
    value: any;
    type: string;
  }[];

  const schema = z.object({
    billingTax: z.number().min(0).max(100, { message: "Tax must be 0 - 100 %" }),
    restaurantName: z.string().min(3, { message: "Restaurant name must be more than 3 character" }).max(25, { message: "Restaurant name must be less than 25 character" }),
    serviceCharge: z.number().min(0).max(100, { message: "Service Charge must be 0 - 100 %" }),
  });
  

  const form = useForm({
    initialValues: {
      billingTax: 0,
      restaurantName: "",
      serviceCharge: 0,
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await http.get("/settings");
        const data = res.data as setting;
        form.setValues({
          billingTax: Number(data.find((s) => s.name === "BILLING_TAX")?.value),
          restaurantName: data.find((s) => s.name === "NAME")?.value,
          serviceCharge: Number(data.find((s) => s.name === "SERVICE_CHARGE")?.value),
        });
        
        
      } catch (error) {}
    })();
  }, [ ]);

  const onUpdateSettings = async (data: any) => {
    try {
      await http.patch(`/settings/BILLING_TAX`, { value: String(data.billingTax) });
      await http.patch(`/settings/NAME`, { value: String(data.restaurantName) });
      await http.patch(`/settings/SERVICE_CHARGE`, { value: String(data.serviceCharge) });
      notifications.show({
        title: "Settings updated",
        message: "Settings updated successfully",
        color: "teal",
      });
    }
    catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong. Please try again later",
        color: "red",
      });
    }

  }


  return (
    <>
      <Group justify="space-between" my="md">
        <Title order={3} size="h2" fw={900} ta="center">
          Settings
        </Title>
        <IconSettings stroke={1.5} size={32} />
      </Group>

      <Card padding="lg" radius="md" withBorder mt="md">
        <form onSubmit={(event) => {
          event.preventDefault();
          form.onSubmit((data) => {
            onUpdateSettings(data);
          })();
        }}>
        <Table fz={16} horizontalSpacing="md" verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Value</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Billing tax</Table.Td>
              <Table.Td>
                <NumberInput 
                min={0}
                {...form.getInputProps("billingTax")} />
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Restaurant Name</Table.Td>
              <Table.Td>
                <TextInput {...form.getInputProps("restaurantName")} />
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Service charge</Table.Td>
              <Table.Td>
                <NumberInput {...form.getInputProps("serviceCharge")} 
                 min={0}/>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
        <Box mt="lg" ta="end">
        <Button
            type="submit"
            variant="filled"
            radius="lg"
            mt="sm"
            color="green"
          >
            Save
          </Button>
        </Box>
        </form>
      </Card>
    </>
  );
}
