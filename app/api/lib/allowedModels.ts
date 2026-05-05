import { ALLOWED_MODELS } from "./models";

export { ALLOWED_MODELS };

export type AllowedModel = string;

export function resolveModel(model: string): AllowedModel | Response {
  const normalized = model.toLowerCase();

  if (!ALLOWED_MODELS.value.includes(normalized)) {
    return Response.json(
      { error: `Unknown model: ${model}` },
      { status: 400 }
    );
  }

  return normalized;
}
