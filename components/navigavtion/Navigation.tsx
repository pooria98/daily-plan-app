"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classes from "./Navigation.module.css";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-12 z-20 w-full h-10 flex bg-[var(--mantine-color-body)]">
      <Link href="/plan" className={`${pathname === "/plan" && classes.active} ${classes.navlink}`}>
        plan
      </Link>
      <Link
        href="/activity"
        className={`${pathname === "/activity" && classes.active} ${classes.navlink}`}
      >
        activity
      </Link>
      <Link
        href="/stats"
        className={`${pathname === "/stats" && classes.active} ${classes.navlink}`}
      >
        stats
      </Link>
    </nav>
  );
}
