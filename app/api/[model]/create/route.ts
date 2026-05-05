import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { resolveModel } from "../../lib/allowedModels";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  const { model } = await params;

  const normalizedModel = resolveModel(model);
  if (normalizedModel instanceof Response) return normalizedModel;

  try {
    const body = await req.json();

    const record = await (prisma as any)[normalizedModel].create({
      data: body,
    });

    return Response.json(record, { status: 201 });
  } catch (error: any) {
    return Response.json(
      { error: error.message ?? "Failed to create record" },
      { status: 500 }
    );
  }
}
