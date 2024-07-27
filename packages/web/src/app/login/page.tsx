import { Center } from "@mantine/core";
import { Login } from "@/components/Auth/Login";

export const metadata = {
  title: "Login",
};

export default async function Page() {
  return (
    <>
      <Center py={100}>
        <Login />
      </Center>
    </>
  );
}
