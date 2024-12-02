import Signup from "@/components/signup/Signup";
import { auth } from "@/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return (
    <div className="auth-container">
      <Signup />
    </div>
  );
}
