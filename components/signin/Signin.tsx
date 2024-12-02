"use client";
import { authClient } from "@/lib/auth-client"; //import the auth client
import { Anchor, Button, Checkbox, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function Signin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const signIn = async (values: FormValues) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
        callbackURL: "/",
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
            message: "Logged in",
          });
          router.push("/");
        },
        onError: (ctx) => {
          setLoading(false);
          if (ctx.error.message.toLowerCase().includes("email")) {
            form.setFieldError("email", ctx.error.message);
          }
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
    <form onSubmit={form.onSubmit(signIn)} className="auth-form">
      <h1 className="auth-header">Sign In</h1>
      <TextInput
        label="Email"
        placeholder="Email"
        type="email"
        key={form.key("email")}
        {...form.getInputProps("email")}
        required
        withAsterisk={false}
      />
      <PasswordInput
        label="Password"
        placeholder="Password"
        key={form.key("password")}
        {...form.getInputProps("password")}
        required
        withAsterisk={false}
      />
      <Checkbox
        my="xs"
        label="Remember me"
        key={form.key("rememberMe")}
        {...form.getInputProps("rememberMe", { type: "checkbox" })}
      />
      <Button type="submit" disabled={loading} loading={loading} mb="md">
        Sign In
      </Button>
      <div>
        <p className="mb-2">
          Forgot password?{" "}
          <Anchor component={Link} href="/forgot-password">
            Reset
          </Anchor>
        </p>
        <p>
          New user?{" "}
          <Anchor component={Link} href="/signup">
            Sign up
          </Anchor>
        </p>
      </div>
    </form>
  );
}
