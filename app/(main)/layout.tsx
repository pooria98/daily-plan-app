import Header from "@/components/header/Header";
import Navigation from "@/components/navigavtion/Navigation";
import { auth } from "@/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  } else {
    return (
      <>
        <Header name={session?.user.name} />
        <Navigation />
        <main className="p-3">{children}</main>
      </>
    );
  }
}
