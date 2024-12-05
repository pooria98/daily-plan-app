"use client";
import { authClient } from "@/lib/auth-client"; //import the auth client
import { Anchor, Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: {
      name: (value) =>
        value.length < 3
          ? "must be at least 2 characters"
          : value.length > 20
          ? "must be less than 20 characters"
          : null,
    },
  });

  const signUp = async (values: FormValues) => {
    await authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
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
            message: "verification email sent",
          });
          router.push("/check-email");
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
    <form onSubmit={form.onSubmit(signUp)} className="auth-form">
      <h1 className="auth-header">Sign Up</h1>
      <TextInput
        label="Name"
        placeholder="Name"
        type="name"
        key={form.key("name")}
        {...form.getInputProps("name")}
        required
        withAsterisk={false}
      />
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
      <Button type="submit" disabled={loading} loading={loading} mb="md">
        Sign Up
      </Button>
      <p>
        Have an account?{" "}
        <Anchor component={Link} href="/signin">
          Sign in
        </Anchor>
      </p>
    </form>
  );
}
