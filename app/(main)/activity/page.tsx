"use client";
import axiosInstance from "@/lib/axios-config";
import { Activities, ApiError } from "@/types/types";
import {
  ActionIcon,
  Autocomplete,
  Button,
  Divider,
  LoadingOverlay,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaCheck, FaTrash, FaX } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { notifications } from "@mantine/notifications";

export default function ActivityPage() {
  const queryClient = useQueryClient();
  const [names, setNames] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState("");
  const [editValues, setEditValues] = useState<Activities>({
    name: "",
    hour: 0,
  });
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      hour: 0,
    },
  });

  const {
    data: activities,
    error,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<Activities[]>({
    queryKey: ["activities"],
    queryFn: async () => {
      const response = await axiosInstance.get("/activities");
      return response.data;
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const uniqueNames: string[] = [...new Set(activities.map((item: Activities) => item.name))];
      setNames(uniqueNames);
    }
  }, [activities, isSuccess]);

  const { mutate: postMutate, isPending: postPending } = useMutation({
    mutationKey: ["activity", "post"],
    mutationFn: async (values: Activities) => {
      const response = await axiosInstance.post("/activities", values);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      form.reset();
      notifications.show({
        color: "green",
        title: "Success",
        message: "Activity added successfully",
      });
    },
  });

  const { mutate: deleteMutate, isPending: deletetPending } = useMutation({
    mutationKey: ["activity", "delete"],
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/activities`, { params: { id } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      notifications.show({
        color: "green",
        title: "Success",
        message: "Activity deleted successfully",
      });
    },
  });

  const { mutate: editMutate, isPending: editPending } = useMutation({
    mutationKey: ["activity", "put"],
    mutationFn: async (id: string) => {
      const response = await axiosInstance.put(`/activities`, editValues, { params: { id } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      setIsEditing("");
      notifications.show({
        color: "green",
        title: "Success",
        message: "Activity edited successfully",
      });
    },
  });

  return (
    <div className="relative w-full max-w-[600px] min-h-[600px] mx-auto flex flex-col justify-start items-center pt-40">
      <LoadingOverlay
        visible={isLoading || postPending || editPending || deletetPending}
        overlayProps={{ bg: "transparent", blur: 5 }}
      />
      <h1 className="text-xl font-semibold mb-4">Add activity</h1>
      <form
        onSubmit={form.onSubmit((values) => postMutate(values))}
        className="w-full flex flex-wrap items-center gap-2 mb-2"
      >
        <Autocomplete
          data={names}
          className="flex-[1_1_200px]"
          placeholder="Title"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <NumberInput
          rightSection="h"
          step={0.5}
          min={0}
          max={24}
          hideControls
          className="flex-[0_1_70px]"
          key={form.key("hour")}
          {...form.getInputProps("hour")}
        />
        <Button type="submit">Add</Button>
      </form>
      <Divider my="lg" w="100%" />
      <h1 className="text-xl font-semibold mb-4">Today</h1>
      {isError && <p>{(error as ApiError)?.response?.data?.error}</p>}
      {isSuccess &&
        activities?.map((activity: Activities) => (
          <div
            key={activity.id}
            className="w-full flex flex-wrap items-center justify-end gap-2 mb-2"
          >
            <TextInput
              className="flex-[1_1_200px]"
              placeholder="Title"
              value={isEditing === activity.id ? editValues.name : activity.name}
              onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
              readOnly={isEditing !== activity.id}
              classNames={{ input: isEditing !== activity.id ? "read-only" : "" }}
            />
            <NumberInput
              rightSection="h"
              step={0.5}
              min={0}
              max={24}
              hideControls
              className="flex-[0_1_70px]"
              value={isEditing === activity.id ? editValues.hour : activity.hour}
              onValueChange={(value) => setEditValues({ ...editValues, hour: value.floatValue! })}
              readOnly={isEditing !== activity.id}
              classNames={{ input: isEditing !== activity.id ? "read-only" : "" }}
            />

            {isEditing === activity.id ? (
              <div className="flex gap-1">
                <ActionIcon
                  color="green"
                  size="lg"
                  onClick={() => {
                    editMutate(activity.id!);
                  }}
                >
                  <FaCheck size="1rem" />
                </ActionIcon>
                <ActionIcon
                  color="red"
                  size="lg"
                  onClick={() => {
                    setIsEditing("");
                    setEditValues({ name: "", hour: 0 });
                  }}
                >
                  <FaX size="1rem" />
                </ActionIcon>
              </div>
            ) : (
              <div className="flex gap-1">
                <ActionIcon
                  size="lg"
                  onClick={() => {
                    setIsEditing(activity.id!);
                    setEditValues({ name: activity.name, hour: activity.hour });
                  }}
                >
                  <FaEdit size="1rem" />
                </ActionIcon>
                <ActionIcon color="red" size="lg" onClick={() => deleteMutate(activity.id!)}>
                  <FaTrash size="1rem" />
                </ActionIcon>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
