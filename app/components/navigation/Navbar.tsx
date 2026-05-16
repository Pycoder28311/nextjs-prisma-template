"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import ProductsMegaMenu from "@/components/navigation/megamenus/ProductsMegaMenu";
import AboutMegaMenu from "@/components/navigation/megamenus/AboutMegaMenu";
import NavSearch from "@/components/navigation/NavSearch";
import HamburgerButton from "@/components/navigation/HamburgerButton";
import RightSidebar from "@/components/navigation/RightSidebar";
import UserMenu from "@/components/navigation/UserMenu";
import UserSidebar from "@/components/navigation/UserSidebar";
import { useTheme } from "next-themes";

type NavLink = {
  href: string;
  label: string;
  megaMenu?: ReactNode;
};

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About", megaMenu: <AboutMegaMenu /> },
  { href: "/products", label: "Products", megaMenu: <ProductsMegaMenu /> },
];

export default function Navbar() {
  const { user } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userSidebarOpen, setUserSidebarOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const activeMegaMenu = activeMenu
    ? navLinks.find((l) => l.label === activeMenu)?.megaMenu
    : undefined;

  return (
    <>
      <nav
        className="bg-white border-b border-gray-200 sticky top-0 z-40"
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="px-6">
          <div className="flex items-center justify-between h-16">

            <div className="flex items-center gap-2">
              <HamburgerButton open={sidebarOpen} onClick={() => setSidebarOpen((v) => !v)} className="hidden md:flex" />
              <Link href="/" className="font-bold text-lg text-gray-900 tracking-tight">
                MyApp
              </Link>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  onMouseEnter={() => setActiveMenu(link.megaMenu ? link.label : null)}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                    {link.megaMenu && (
                      <svg
                        className={`w-3.5 h-3.5 text-gray-400 transition-transform ${activeMenu === link.label ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>
                </div>
              ))}
            </div>

            {/* Desktop user + sidebar trigger */}
            <div
              className="hidden md:flex items-center gap-2"
              onMouseEnter={() => setActiveMenu(null)}
            >
              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Toggle theme"
                >
                  {resolvedTheme === "dark" ? (
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              )}
              <NavSearch iconMode />
              <UserMenu user={user} />
            </div>

            {/* Mobile right side */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setUserSidebarOpen((v) => !v)}
                aria-label="Open user menu"
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {user?.image ? (
                  <img src={user.image} alt={user.name ?? "User"} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </button>
              <HamburgerButton open={menuOpen} onClick={() => setMenuOpen((v) => !v)} />
            </div>
          </div>
        </div>

        {/* Megamenu panel */}
        {activeMegaMenu && (
          <div className="absolute left-0 top-full w-full bg-white border-t border-gray-100 shadow-lg z-40">
            <div className="max-w-6xl mx-auto px-4 py-6">
              {activeMegaMenu}
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-1">
            <div className="mb-2">
              <NavSearch placeholder="Search..." className="w-full" />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-gray-100">
              {user ? (
                <span className="text-sm font-medium text-gray-700 px-3">{user.name ?? user.email}</span>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-center bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <RightSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} title="Sidebar" side="left">
        <p className="text-sm text-gray-500">Add your sidebar content here.</p>
      </RightSidebar>

      <UserSidebar open={userSidebarOpen} onClose={() => setUserSidebarOpen(false)} content={
        user ? (
          <div className="flex flex-col gap-1">
            <div className="mb-4 pb-4 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-800 truncate">{user.name ?? "User"}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <Link href="/profile" onClick={() => setUserSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>
            <Link href="/settings" onClick={() => setUserSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <Link href="/api/auth/signout" onClick={() => setUserSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link href="/login" onClick={() => setUserSidebarOpen(false)} className="block text-sm text-center bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors">
              Sign in
            </Link>
            <Link href="/register" onClick={() => setUserSidebarOpen(false)} className="block text-sm text-center border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              Register
            </Link>
          </div>
        )
      } />
    </>
  );
}
