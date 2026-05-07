import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ALLOWED_MODELS } from "../lib/allowedModels";
import { ALL } from "dns";

export async function GET() {
  const dmmf = (prisma as any)._dmmf;
  console.log(dmmf)

  if (!dmmf) {
    return NextResponse.json(
      { error: "Cannot access DMMF (make sure you're using Prisma 4.x)" },
      { status: 500 }
    );
  }

  const result: Record<string, any[]> = {};

  for (const model of ALLOWED_MODELS.value) {
    console.log(model)
    const modelKey = model.charAt(0).toUpperCase() + model.slice(1);
    const modelDef = dmmf.datamodel.models.find(
      (m: any) => m.name === modelKey
    );

    if (!modelDef) continue;

    result[model] = modelDef.fields.map((field: any) => ({
      // ========================
      // BASIC INFO
      // ========================
      name: field.name,
      type: field.type,
      kind: field.kind, // scalar | object | enum

      // ========================
      // STRUCTURE
      // ========================
      isRequired: field.isRequired,
      isList: field.isList,
      isNullable: field.isOptional || !field.isRequired,

      // ========================
      // IDENTIFIERS
      // ========================
      isId: field.isId,
      isUnique: field.isUnique,

      // ========================
      // DEFAULTS (🔥 ONLY DMMF HAS REAL VALUES)
      // ========================
      hasDefaultValue: field.hasDefaultValue,
      default: field.default ?? null, // 👈 THIS is what you wanted

      // ========================
      // RELATIONS
      // ========================
      relationName: field.relationName ?? null,
      relationFromFields: field.relationFromFields ?? [],
      relationToFields: field.relationToFields ?? [],
      relationOnDelete: field.relationOnDelete ?? null,
      relationOnUpdate: field.relationOnUpdate ?? null,

      // ========================
      // ENUM INFO
      // ========================
      isEnum: field.kind === "enum",

      // ========================
      // EXTRA METADATA
      // ========================
      documentation: field.documentation ?? null,

      // ========================
      // SPECIAL FIELDS
      // ========================
      isUpdatedAt: field.isUpdatedAt ?? false,
      isGenerated: field.isGenerated ?? false,
    }));
  }

  return NextResponse.json(result);
}