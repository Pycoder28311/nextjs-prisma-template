"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { User } from "@/framework/types";
import { useAbsoluteModal } from "@/framework/ui/context/AppContext";
import Text from "@/framework/ui/iconText/Text";

type Props = {
  user: User | null;
};

export default function UserMenu({ user }: Props) {
  const modal = useAbsoluteModal<HTMLButtonElement>();
  const close = () => modal.close();

  // Escape closes (AbsoluteModal handles outside-click itself).
  useEffect(() => {
    if (!modal.isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") modal.close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal.isOpen]);

  const menu = (
    <div className="w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden py-1">
      {user ? (
        <>
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-800 truncate">{user.name ?? "User"}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <Link href="/profile" onClick={close} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
            <Text icon="user" size="small" className="text-gray-400" />
            <Text value="Profile" size="small" />
          </Link>
          <Link href="/settings" onClick={close} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
            <Text icon="settings" size="small" className="text-gray-400" />
            <Text value="Settings" size="small" />
          </Link>
          <div className="border-t border-gray-100 mt-1 pt-1">
            <Link href="/auth/signout" onClick={close} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
              <Text icon="logout" size="small" />
              <Text value="Sign out" size="small" />
            </Link>
          </div>
        </>
      ) : (
        <Link href="/auth/signin" onClick={close} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
          <Text value="Sign in" size="small" />
        </Link>
      )}
    </div>
  );

  return (
    <button
      {...modal.triggerProps}
      type="button"
      onClick={() => modal.toggle({ component: menu, side: "bottom", align: "end", offset: 8 })}
      aria-label="User menu"
      className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
        modal.isOpen ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"
      }`}
    >
      {user?.image ? (
        <img src={user.image} alt={user.name ?? "User"} className="w-9 h-9 rounded-full object-cover" />
      ) : (
        <Text icon="user" size="medium" className="text-gray-600" />
      )}
    </button>
  );
}
