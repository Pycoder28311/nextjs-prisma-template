"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  email: string;
  name: string | null;
  isAdmin: boolean;
};

export default function UsersPage() {
  const [user, setUser] = useState<User | null>(null);
  const fetchUser = async () => {
    try {

      const res = await fetch("/api/session"); // <-- your API route
      const data = await res.json();

      setUser(data?.user ?? null);
      console.log(data)
    } catch (err) {
      console.error(err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      {user?.name}
    </div >
  );
}