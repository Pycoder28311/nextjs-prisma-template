"use client";

import type { Product } from "@/types";
import { useTable } from "@/lib/useTable";
import DataForm from "@/components/DataForm";
import GridLayout from "@/components/GridLayout";
import ProductCard from "@/components/ProductCard";
import CrudButton from "@/components/CrudButton";
import EditInput from "@/components/EditInput";

export default function HomePage() {
  const productData = useTable<Product>("product");
  const productChildData = useTable<Product>("ProductChild");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">New Product</h2>
          <DataForm table="product" onSuccess={productData.append} />
        </div>

        <GridLayout title="Products" layout="one-column" table="product" onReorder={productData.reorder}>
          {productData.records.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </GridLayout>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">New Product</h2>
        <DataForm table="productChild" onSuccess={productChildData.append} />
      </div>

      <GridLayout title="Products" layout="one-column" table="productChild" onReorder={productChildData.reorder}>
        {productChildData.records.map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-xl shadow-sm px-5 py-3 flex items-center gap-6">
            <EditInput value={product.name ?? ""} table="productChild" field="name" id={product.id} />
            <CrudButton
              type="delete"
              table="productChild"
              loading={productChildData.isDeletingId(product.id)}
              onClick={() => productChildData.remove(product.id)}
            />
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
