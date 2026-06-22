"use client";

import Link from "next/link";
import Text from "@/framework/ui/iconText/Text";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <Text value="MyApp" size="medium" className="font-bold text-gray-900 tracking-tight" />

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                <Text value={link.label} size="small" />
              </Link>
            ))}
          </div>

          <Text
            value={`© ${new Date().getFullYear()} MyApp. All rights reserved.`}
            size="small"
            className="text-gray-400"
          />
        </div>
      </div>
    </footer>
  );
}
