import { Notification } from "@mantine/core";

export default async function Home({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const parameter = (await searchParams).error;
  return (
    <main>
      {parameter && (
        <Notification color="red" closeButtonProps={{ size: 0 }}>
          {parameter}
        </Notification>
      )}
      main page
    </main>
  );
}
