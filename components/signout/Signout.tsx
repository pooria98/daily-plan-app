"use client";
import { authClient } from "@/lib/auth-client";
import { Button, ButtonProps } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";

export default function Signout({ ...props }: ButtonProps) {
  const router = useRouter();

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin"); // redirect to signin page
        },
      },
    });
  };
  return (
    <Button onClick={signOut} {...props}>
      Sign Out
    </Button>
  );
}
