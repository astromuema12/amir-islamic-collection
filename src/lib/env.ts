import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL connection string"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  AUTH_URL: z.string().url().optional(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_UPLOAD_PRESET: z.string().optional(),

  PAYSTACK_SECRET_KEY: z.string().min(1, "PAYSTACK_SECRET_KEY is required for payments"),

  RESEND_API_KEY: z.string().optional(),

  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
  NEXT_PUBLIC_APP_NAME: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z.string().optional(),
});

type ServerEnv = z.infer<typeof serverSchema>;
type ClientEnv = z.infer<typeof clientSchema>;

let _serverEnv: ServerEnv | null = null;
let _clientEnv: ClientEnv | null = null;

function isBuildTime(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build" ||
    process.env._STANDALONE_BUILD === "true";
}

function formatErrors(result: z.ZodFormattedError<unknown>): string {
  return Object.entries(result)
    .filter(([, v]) => v && "_errors" in v && (v as { _errors: string[] })._errors.length > 0)
    .map(([k, v]) => `  ${k}: ${(v as { _errors: string[] })._errors.join(", ")}`)
    .join("\n");
}

function validateServerEnv(): ServerEnv {
  if (_serverEnv) return _serverEnv;

  const result = serverSchema.safeParse(process.env);
  if (!result.success) {
    const errors = formatErrors(result.error.format());

    if (isBuildTime()) {
      console.warn("\n⚠️  Server env validation warnings (build time):\n" + errors + "\n");
      // During build, return defaults so the build can succeed.
      // Runtime will re-validate when env vars are actually available.
      return {
        DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost:5432/build_placeholder",
        AUTH_SECRET: process.env.AUTH_SECRET || "build_placeholder",
        PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY || "sk_build_placeholder",
      } as ServerEnv;
    }

    console.error("\n❌ Invalid server environment variables:\n" + errors + "\n");
    throw new Error("Invalid server environment variables. Check server logs for details.");
  }

  _serverEnv = result.data;
  return _serverEnv;
}

function validateClientEnv(): ClientEnv {
  if (_clientEnv) return _clientEnv;

  const result = clientSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  });

  if (!result.success) {
    const errors = formatErrors(result.error.format());

    if (isBuildTime()) {
      console.warn("\n⚠️  Client env validation warnings (build time):\n" + errors + "\n");
      return {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      } as ClientEnv;
    }

    console.error("\n❌ Invalid client environment variables:\n" + errors + "\n");
    throw new Error("Invalid client environment variables. Check server logs for details.");
  }

  _clientEnv = result.data;
  return _clientEnv;
}

export function getServerEnv(): ServerEnv {
  return validateServerEnv();
}

export function getClientEnv(): ClientEnv {
  return validateClientEnv();
}
