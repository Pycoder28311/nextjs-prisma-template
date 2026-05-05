"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async () => {
    if (!name || !email) return;

    await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

    setName("");
    setEmail("");
    fetchUsers();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Users</h1>

      {/* CREATE USER */}
      <div className="bg-red-100 p-4 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          type="email"
        />
        <button onClick={createUser}>
          Create
        </button>
      </div>

      {/* LIST USERS */}
      {
        users.map((user) => (
          <div key={user.id}>
            {user.name} — {user.email}
          </div>
        ))
      }
    </div >
  );
}