"use client";
import { authClient } from "@/lib/auth-client";
import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
    },
  });

  const forgotPassword = async (values: { email: string }) => {
    await authClient.forgetPassword(
      {
        email: values.email,
        redirectTo: "/reset-password",
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          notifications.show({
            color: "green",
            title: "Success",
            message: "Check you email for reset password link",
          });
          router.push("/check-email");
        },
        onError: (ctx) => {
          setLoading(false);
          if (ctx.error.message.toLowerCase().includes("email")) {
            form.setFieldError("email", ctx.error.message);
          }
          notifications.show({
            color: "red",
            message: ctx.error.message,
          });
        },
      }
    );
  };
  return (
    <form onSubmit={form.onSubmit(forgotPassword)} className="auth-form">
      <h1 className="auth-header">Forgot Password</h1>
      <TextInput
        label="Email"
        placeholder="Email"
        type="email"
        key={form.key("email")}
        {...form.getInputProps("email")}
        required
        withAsterisk={false}
      />
      <Button type="submit" disabled={loading} loading={loading}>
        Send Email
      </Button>
    </form>
  );
}
