// src/lib/prisma.ts

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const client = new PrismaClient({ log: ["error"] });

  // Retry once when the DB has dropped the idle connection (Railway/MySQL wait_timeout).
  client.$use(async (params, next) => {
    try {
      return await next(params);
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      const stale =
        e?.code === "P1017" ||
        (typeof e?.message === "string" &&
          e.message.includes("Server has closed the connection"));
      if (!stale) throw err;
      await client.$disconnect().catch(() => {});
      await client.$connect().catch(() => {});
      return next(params);
    }
  });

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}