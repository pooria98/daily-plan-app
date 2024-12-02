import Link from "next/link";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import Signout from "../signout/Signout";
import { Group } from "@mantine/core";

export default function Header({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-30 w-full h-12 flex justify-between items-center px-2 shadow bg-[var(--mantine-color-body)]">
      <Group>
        <DarkModeToggle />
        <Link
          href="/profile"
          className="inline-block py-1 px-2 text-lg rounded-full font-semibold text-black dark:text-white hover:bg-[var(--mantine-color-default-hover)]"
        >
          {name}
        </Link>
      </Group>
      <Signout radius="xl" variant="subtle" />
    </header>
  );
}
