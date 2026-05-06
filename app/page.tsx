"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { useApp } from "@/context/AppContext";
import { createRecord, readRecords, type CrudState } from "@/lib/crud";
import EditInput from "@/components/EditInput";

export default function UsersPage() {
  const { user } = useApp();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productsState, setProductsState] = useState<CrudState<Product[]>>({ result: undefined, loading: { model: "product", operation: "read", status: "idle", startedAt: 0, durationMs: null } });
  useEffect(() => {
    readProducts();
  }, []);

  const readProducts = async () => {
    await readRecords<Product>("product", {}, { id: true, name: true, price: true }, (state) => {
      setProductsState(state);
    });
  };

  const createProduct = async () => {
    await createRecord<Product>(
      "product",
      { name: productName, price: productPrice },
      (state) => {
        if (state.result) {
          setProductsState((prev) => ({ ...prev, result: [...(prev.result ?? []), state.result!] }));
          setProductName("");
          setProductPrice(0);
        }
      },
      () => !!productName && !!productPrice,
    );
  };

  const { status, operation, model, durationMs } = productsState.loading;

  return (
    <div>
      <div>
        [{status}] {operation} on <strong>{model}</strong>
        {durationMs != null && ` — ${durationMs}ms`}
      </div>

      <div>
        <input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product name"
        />
        <input
          value={productPrice}
          onChange={(e) => setProductPrice(Number(e.target.value))}
          placeholder="Price"
          type="number"
        />
        <button onClick={createProduct}>Create Product</button>
      </div>

      <div>
        {productsState.result?.map((product) => (
          <div key={product.id}>
            <EditInput value={product.name ?? ""} table="product" field="name" id={product.id} />
            <EditInput value={product.price} table="product" field="price" id={product.id} />
          </div>
        ))}
      </div>

    </div>
  );
}
