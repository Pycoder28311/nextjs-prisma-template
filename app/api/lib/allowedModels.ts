export const ALLOWED_MODELS = [
  "user",
  "account",
  "session",
  "verificationToken",
  "passwordReset",
  "email",
  "image",
  "product",
] as const;

export type AllowedModel = (typeof ALLOWED_MODELS)[number];

export function resolveModel(model: string): AllowedModel | Response {
  const normalized = model.toLowerCase() as AllowedModel;

  if (!ALLOWED_MODELS.includes(normalized)) {
    return Response.json(
      { error: `Unknown model: ${model}` },
      { status: 400 }
    );
  }

  return normalized;
}
