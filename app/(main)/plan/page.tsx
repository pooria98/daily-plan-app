/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  TextInput,
  NumberInput,
  Button,
  ActionIcon,
  Group,
  Divider,
  LoadingOverlay,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { FaTrash } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-config";
import { useEffect } from "react";
import { ApiError, Plan } from "@/types/types";
import { notifications } from "@mantine/notifications";

export default function PlanPage() {
  const queryClient = useQueryClient();

  const form = useForm({
    mode: "controlled",
    initialValues: {
      name: "",
      activities: [{ title: "", hour: 0 }],
    },
  });

  const fields = form.getValues().activities.map((item, index) => (
    <div key={index} className="flex flex-wrap items-center gap-2 mb-2">
      <TextInput
        placeholder="Title"
        className="flex-[1_1_200px]"
        key={form.key(`activities.${index}.title`)}
        {...form.getInputProps(`activities.${index}.title`)}
      />
      <NumberInput
        rightSection="h"
        step={0.5}
        min={0}
        max={24}
        hideControls
        className="flex-[0_1_70px]"
        key={form.key(`activities.${index}.hour`)}
        {...form.getInputProps(`activities.${index}.hour`)}
      />
      <ActionIcon color="red" size="lg" onClick={() => form.removeListItem("activities", index)}>
        <FaTrash size="1rem" />
      </ActionIcon>
    </div>
  ));

  const {
    data: plans,
    error,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["plan"],
    queryFn: async () => {
      const response = await axiosInstance.get("/plan");
      return response.data;
    },
  });

  useEffect(() => {
    if (isSuccess) {
      form.setValues(plans);
    }
  }, [isSuccess]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["plan"],
    mutationFn: async (values: Plan) => {
      await axiosInstance.post("/plan", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan"] });
      notifications.show({
        color: "green",
        message: "Success",
      });
    },
  });

  return (
    <div className="relative w-full max-w-[600px] min-h-[600px] mx-auto flex justify-center items-center">
      <LoadingOverlay visible={isLoading || isPending} />
      {isError && <p>{(error as ApiError)?.response?.data?.error}</p>}
      {isSuccess && (
        <form onSubmit={form.onSubmit((values) => mutate(values))}>
          {fields}
          <Group justify="space-between" mt="md">
            <Button
              variant="outline"
              onClick={() =>
                form.insertListItem("activities", { title: "", hour: 0, key: randomId() })
              }
            >
              Add activity
            </Button>
            <p
              className={`${
                form.getValues().activities.reduce((a, b) => a + b.hour, 0) > 24
                  ? "text-red-500"
                  : ""
              }`}
            >
              SUM: {form.getValues().activities.reduce((a, b) => a + b.hour, 0)}
            </p>
          </Group>
          <Divider my="xs" />
          <Button type="submit" fullWidth>
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}
