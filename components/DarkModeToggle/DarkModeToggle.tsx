"use client";

import classes from "./DarkModeToggle.module.css";
import { useMantineColorScheme, useComputedColorScheme } from "@mantine/core";
import { FaMoon } from "react-icons/fa6";
import { FiSun } from "react-icons/fi";

export default function DarkModeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });

  return (
    <div
      onClick={() => setColorScheme(computedColorScheme === "light" ? "dark" : "light")}
      className="size-9 p-2 border rounded-full flex justify-center items-center cursor-pointer hover:bg-[var(--mantine-color-default-hover)]"
      aria-label="Toggle color scheme"
    >
      <FaMoon size={22} className={classes.moonIcon} />
      <FiSun size={22} className={classes.sunIcon} />
    </div>
  );
}
