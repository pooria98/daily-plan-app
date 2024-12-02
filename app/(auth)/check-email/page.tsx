import { Card, Center, Group, Stack } from "@mantine/core";
import { FaCircleCheck } from "react-icons/fa6";

export default function CheckEmailPage() {
  return (
    <Center h="100dvh">
      <Card shadow="md" p="lg" radius="lg">
        <Stack align="center">
          <Group wrap="nowrap" className="text-2xl font-bold">
            <FaCircleCheck color="green" />
            <p>Email sent</p>
          </Group>
          <p className="text-lg">please check your inbox or spam folder</p>
        </Stack>
      </Card>
    </Center>
  );
}
