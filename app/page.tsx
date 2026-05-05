"use client";

import { useEffect, useState } from "react";
import type { User } from "@/types";

export default function UsersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [products, setProducts] = useState<any[]>([]);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/session");
      const data = await res.json();
      setUser(data?.user ?? null);
    } catch (err) {
      console.error(err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
    readProducts();
  }, []);

  const readProducts = async () => {
    const res = await fetch("/api/product/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        where: {},
        select: { id: true, name: true, price: true },
      }),
    });
    const data = await res.json();
    setProducts(data);
  };

  const createProduct = async () => {
    if (!productName || !productPrice) return;

    await fetch("/api/product/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: productName, price: parseFloat(productPrice) }),
    });

    setProductName("");
    setProductPrice("");
  };

  return (
    <div>
      {user?.name}

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