import { auth } from "@/auth"; // path to your Better Auth server instance
import { Button } from "@mantine/core";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const parameter = (await searchParams).error;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/plan");
  } else if (!parameter) {
    redirect("/signin");
  }

  if (parameter) {
    return (
      <main className="w-full min-h-[100dvh] flex justify-center items-center">
        <div className="border shadow-md p-4 rounded-md">
          <h1 className="text-center text-xl font-bold mb-4">Error: {parameter}</h1>
          <p className="text-center">invalid or expired token</p>
          <p className="text-center mb-4">sign in again to get a new email</p>
          <Button component={Link} href="/signin" fullWidth>
            Sign in
          </Button>
        </div>
      </main>
    );
  }
}
