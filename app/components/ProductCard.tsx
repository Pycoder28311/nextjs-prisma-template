"use client";

import type { Product } from "@/framework/types";
import EditInput from "@/framework/data/EditInput";
import CrudButton from "@/framework/data/buttons/CrudButton";
import { useTable } from "@/framework/utils/useTable";

type Props = {
  product: Product;
};


export default function ProductCard({ product }: Props) {
  const { remove, isDeletingId, update } = useTable<Product>("product");
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-5 py-3 flex items-center gap-6">
      <EditInput value={product.name ?? ""} table="product" field="name" id={product.id} update={(data) => update(product.id, data)} />
      <EditInput value={product.price} table="product" field="price" id={product.id} update={(data) => update(product.id, data)} />
      <CrudButton
        type="delete"
        table="product"
        loading={isDeletingId(product.id)}
        onClick={() => remove(product.id)}
      />
    </div>
  );
}
