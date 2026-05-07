"use client";

import type { Product, ProductTest } from "@/types";
import { useTable } from "@/lib/useTable";
import DataForm from "@/components/DataForm";
import GridLayout from "@/components/GridLayout";
import ProductCard from "@/components/ProductCard";
import EditInput from "@/components/EditInput";
import CrudButton from "@/components/CrudButton";

export default function UsersPage() {
  const { records, append } = useTable<Product>("product");
  const { records: recordsTest, append: appendTest, isDeletingId: isDeletingTestId, remove: removeTest } = useTable<ProductTest>("productTest");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">New Product</h2>
          <DataForm table="product" onSuccess={append} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">New Product Test</h2>
          <DataForm table="productTest" onSuccess={appendTest} />
        </div>

        <GridLayout title="Products" layout="one-column" table="product">
          {records.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </GridLayout>

        <GridLayout title="Products" layout="one-column" table="productTest">
          {recordsTest.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-xl shadow-sm px-5 py-3 flex items-center gap-6">
              <EditInput value={product.price} table="productTest" field="price" id={product.id} />
              <CrudButton
                type="delete"
                table="productTest"
                loading={isDeletingTestId(product.id)}
                onClick={() => removeTest(product.id)}
              />
            </div>
          ))}
        </GridLayout>

      </div>
    </div>
  );
}
