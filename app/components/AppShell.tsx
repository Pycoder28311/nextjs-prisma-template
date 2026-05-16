"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";

const SHELL_HIDDEN_PATHS = [
  "/login",
  "/register",
  "/auth",
  "/about",
];

function isShellHidden(pathname: string) {
  return SHELL_HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideShell = isShellHidden(pathname);

  return (
    <>
      {!hideShell && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideShell && <Footer />}
    </>
  );
}
