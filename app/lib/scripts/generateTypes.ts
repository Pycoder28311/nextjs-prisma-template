import fs from "fs";
import path from "path";
import { ALLOWED_MODELS } from "@/api/lib/allowedModels";

const models = ALLOWED_MODELS.value;

// convert back to Prisma type names (User, ProductChild, etc.)
const prismaTypes = models.map(
  (m) => m.charAt(0).toUpperCase() + m.slice(1)
);

const content = `export type {
  ${prismaTypes.join(",\n  ")}
} from "@prisma/client";
`;

const outputPath = path.join(
  process.cwd(),
  "app/config/types/index.ts"
);

fs.mkdirSync(path.dirname(outputPath), {
  recursive: true,
});

fs.writeFileSync(outputPath, content);

console.log("✅ Prisma model types generated");