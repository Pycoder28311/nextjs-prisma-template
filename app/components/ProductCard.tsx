"use client";

import type { Product } from "@/config/types";
import EditInput from "@/components/EditInput";
import CrudButton from "@/components/CrudButton";
import { useTable } from "@/utils/useTable";

type Props = {
  product: Product;
};


export default function ProductCard({ product }: Props) {
  const { remove, isDeletingId } = useTable<Product>("product");
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-5 py-3 flex items-center gap-6">
      <EditInput value={product.name ?? ""} table="product" field="name" id={product.id} />
      <EditInput value={product.price} table="product" field="price" id={product.id} />
      <CrudButton
        type="delete"
        table="product"
        loading={isDeletingId(product.id)}
        onClick={() => remove(product.id)}
      />
    </div>
  );
}
