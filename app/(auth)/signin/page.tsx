import Signin from "@/components/signin/Signin";
import { auth } from "@/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SigninPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return (
    <div className="auth-container">
      <Signin />
    </div>
  );
}
