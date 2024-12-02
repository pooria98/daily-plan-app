"use client";
import { authClient } from "@/lib/auth-client";
import { Button, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: (value, values) =>
        value !== values.confirmPassword ? "Passwords don't match" : null,
    },
  });

  const resetPassword = async (values: { password: string }) => {
    await authClient.resetPassword(
      {
        newPassword: values.password,
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
            message: "Password reset successfully",
          });
          router.push("/login");
        },
        onError: (ctx) => {
          setLoading(false);
          if (ctx.error.message.toLowerCase().includes("password")) {
            form.setFieldError("password", ctx.error.message);
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
    <form onSubmit={form.onSubmit(resetPassword)} className="auth-form">
      <h1 className="auth-header">Reset Password</h1>
      <PasswordInput
        label="New password"
        placeholder="New password"
        key={form.key("password")}
        {...form.getInputProps("password")}
        required
        withAsterisk={false}
      />
      <PasswordInput
        label="Confirm Password"
        placeholder="Confirm Password"
        key={form.key("confirmPassword")}
        {...form.getInputProps("confirmPassword")}
        required
        withAsterisk={false}
      />
      <Button type="submit" disabled={loading} loading={loading}>
        Reset Password
      </Button>
    </form>
  );
}
