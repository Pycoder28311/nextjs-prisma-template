"use client";

import type { Product, TestTable } from "@/config/types";
import { useTable } from "@/utils/useTable";
import DataForm from "@/components/DataForm";
import GridLayout from "@/components/GridLayout";
import ProductCard from "@/components/ProductCard";
import CrudButton from "@/components/CrudButton";
import EditInput from "@/components/EditInput";

export default function HomePage() {
  const productData = useTable<Product>("product");
  const testTable = useTable<TestTable>("testTable");

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

      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">New Test Entry</h2>
          <DataForm table="testTable" onSuccess={testTable.append} />
        </div>

        <GridLayout title="Test Entries" layout="one-column" table="testTable" onReorder={testTable.reorder}>
          {testTable.records.map((testEntry) => (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-5 py-3 flex items-center gap-6">
              <EditInput value={testEntry.name ?? ""} table="testTable" field="name" id={testEntry.id} />
              <EditInput value={testEntry.address ?? ""} table="testTable" field="address" id={testEntry.id} />
              <CrudButton
                type="delete"
                table="testTable"
                loading={testTable.isDeletingId(testEntry.id)}
                onClick={() => testTable.remove(testEntry.id)}
              />
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
}
