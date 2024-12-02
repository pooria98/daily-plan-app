"use client";
import { TextInput, NumberInput, Button, ActionIcon, Group, Divider } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { FaTrash } from "react-icons/fa6";

export default function PlanPage() {
  const form = useForm({
    mode: "controlled",
    initialValues: {
      activities: [{ title: "", hour: 0, key: randomId() }],
    },
  });

  const fields = form.getValues().activities.map((item, index) => (
    <div key={item.key} className="flex flex-wrap items-center gap-2 mb-2">
      <TextInput
        placeholder="Title"
        className="flex-[1_1_250px]"
        key={form.key(`activities.${index}.title`)}
        {...form.getInputProps(`activities.${index}.title`)}
      />
      <NumberInput
        hideControls
        className="flex-[0_1_60px]"
        key={form.key(`activities.${index}.hour`)}
        {...form.getInputProps(`activities.${index}.hour`)}
        suffix="h"
      />
      <ActionIcon color="red" size="lg" onClick={() => form.removeListItem("activities", index)}>
        <FaTrash size="1rem" />
      </ActionIcon>
    </div>
  ));

  return (
    <div className="w-full max-w-[600px] min-h-[600px] mx-auto flex justify-center items-center">
      <div>
        {fields}
        <Group justify="space-between" mt="md">
          <Button
            onClick={() =>
              form.insertListItem("activities", { title: "", hour: 0, key: randomId() })
            }
          >
            Add activity
          </Button>
          <p>SUM: {form.getValues().activities.reduce((a, b) => a + b.hour, 0)}</p>
        </Group>
        <Divider my="xs" />
        <Button type="submit" fullWidth>
          Submit
        </Button>
      </div>
    </div>
  );
}
