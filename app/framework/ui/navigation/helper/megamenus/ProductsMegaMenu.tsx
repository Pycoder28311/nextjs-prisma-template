"use client";

import Link from "next/link";
import Text from "@/framework/ui/iconText/Text";

const categories = [
  { label: "Electronics", description: "Phones, laptops, accessories", href: "/products/electronics", icon: "⚡" },
  { label: "Clothing", description: "Shirts, pants, shoes", href: "/products/clothing", icon: "👕" },
  { label: "Home & Garden", description: "Furniture, tools, decor", href: "/products/home", icon: "🏠" },
  { label: "Sports", description: "Gear, apparel, equipment", href: "/products/sports", icon: "🏃" },
];

const featured = [
  { label: "New Arrivals", href: "/products/new" },
  { label: "Best Sellers", href: "/products/best-sellers" },
  { label: "Sale", href: "/products/sale" },
];

export default function ProductsMegaMenu() {
  return (
    <div className="w-screen bg-white border-t border-gray-100 shadow-lg z-40">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-3 grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <Text value={cat.icon} size="big" className="leading-none mt-0.5" />
                <div className="flex flex-col">
                  <Text value={cat.label} size="small" className="font-medium text-gray-800 group-hover:text-gray-900" />
                  <Text value={cat.description} size="very small" className="text-gray-500 mt-0.5" />
                </div>
              </Link>
            ))}
          </div>
          <div className="border-l border-gray-100 pl-8 flex flex-col gap-1">
            <Text value="Featured" size="very small" className="font-semibold text-gray-400 uppercase tracking-wider mb-2" />
            {featured.map((item) => (
              <Link key={item.href} href={item.href} className="text-gray-600 hover:text-gray-900 py-1 transition-colors">
                <Text value={item.label} size="small" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
