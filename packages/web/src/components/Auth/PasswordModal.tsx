import { http } from "@/modules/http";
import { User } from "@/types/entity";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Button, PasswordInput, Stack } from "@mantine/core";
import { IconLock, IconLockCog } from "@tabler/icons-react";

interface ChangePassModalProps {
  user: User;
  closeP: () => void;
}

export const ChangePasswordModal = ({ user , closeP }: ChangePassModalProps) => {
  const form = useForm({
    initialValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },

    validate: {
      password: (value) =>
        value?.length < 8 ? "Password must be longer than 8" : null,
      newPassword: (value) =>
        value?.length < 8 ? "Password must be longer than 8" : null,
      confirmPassword: (value, pass) =>
        value != pass.newPassword ? "Password does not match" : null,
    },
  });

  const ChangePassword = async (
    values: {
      password: string;
      newPassword: string;
    },
    id: string
  ) => {
    try {
      await http.patch(`/auth/${id}`, values);
      notifications.show({
        title: "Success",
        message: "Success to change password",
        color: "green",
      });
    } catch (error) {
      console.log(values.password, values.newPassword);
      notifications.show({
        title: "Failed",
        message: "Failed to change password",
        color: "red",
      });
    }
    closeP();
  };

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          ChangePassword(
            {
              password: values.password || "",
              newPassword: values.newPassword,
            },
            user.id
          );
        })}
      >
        <Stack w={400} px={20} py={10}>
          <PasswordInput
            leftSection={<IconLock size={18} />}
            withAsterisk
            label="Password"
            placeholder="Password"
            name="Password"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            leftSection={<IconLockCog size={18} />}
            withAsterisk
            label="New password"
            placeholder="New password"
            name="New Password"
            {...form.getInputProps("newPassword")}
          />
          <PasswordInput
            leftSection={<IconLockCog size={18} />}
            withAsterisk
            label="Confirm password"
            placeholder="Confirm password"
            name="Confirm Password"
            {...form.getInputProps("confirmPassword")}
          />
          <Button type="submit">Confirm change</Button>
        </Stack>
      </form>
    </>
  );
};
