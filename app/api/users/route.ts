// src/app/api/users/route.ts

import { prisma } from "@/lib/prisma";

// GET users
export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}

// CREATE user
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
      },
    });

    return Response.json(user);
  } catch (error) {
    return Response.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}