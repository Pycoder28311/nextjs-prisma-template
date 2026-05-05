"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { useApp } from "@/context/AppContext";
import { createRecord, readRecords } from "@/lib/crud";

export default function UsersPage() {
  const { user, loading, setLoading } = useApp();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [prismaFields, setPrismaFields] = useState<Record<string, any[]>>({});

  useEffect(() => {
    readProducts();
    fetch("/api/prisma-fields")
      .then((res) => res.json())
      .then(setPrismaFields);
  }, []);

  console.log(prismaFields)

  const readProducts = async () => {
    await readRecords("product", {}, { id: true, name: true, price: true }, setProducts, undefined, undefined, setLoading);
  };

  const createProduct = async () => {
    await createRecord(
      "product",
      { name: productName, price: parseFloat(productPrice) },
      setProducts,
      () => { setProductName(""); setProductPrice(""); },
      () => !!productName && !!productPrice,
      setLoading
    );
  };

  return (
    <div>

      {loading && loading?.status !== "loaded" && (
        <div>
          Loading {loading.operation} on <strong>{loading.model}</strong>...
        </div>
      )}

      <div>
        <input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product name"
        />
        <input
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          placeholder="Price"
          type="number"
        />
        <button onClick={createProduct}>Create Product</button>
      </div>

      <div>
        {products.map((product) => (
          <div key={product.id}>
            {product.name} — {product.price}
          </div>
        ))}
      </div>

    </div>
  );
}