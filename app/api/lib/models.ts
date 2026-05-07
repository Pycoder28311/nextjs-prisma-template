import { prisma } from "@/lib/prisma";

function getAllModels(): string[] {
  const dmmf = (prisma as any)._dmmf;

  if (!dmmf) {
    throw new Error("DMMF not available yet");
  }

  return dmmf.datamodel.models.map((model: any) => {
    const name: string = model.name;
    return name[0].toLowerCase() + name.slice(1);
  });
}

export const ALLOWED_MODELS = {
  get value() {
    return getAllModels();
  },
};
