import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { getDatabase } from "@/lib/db";
import { authSchema } from "@/lib/db/schema";

export function createAuth() {
  const secret = process.env.BETTER_AUTH_SECRET;
  const baseURL = process.env.BETTER_AUTH_URL;

  if (!secret || !baseURL) {
    throw new Error("BETTER_AUTH_SECRET and BETTER_AUTH_URL must be configured before auth routes are enabled.");
  }

  return betterAuth({
    appName: "Odhvica",
    secret,
    baseURL,
    database: drizzleAdapter(getDatabase(), {
      provider: "pg",
      schema: authSchema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      twoFactor({
        issuer: "Odhvica Staff",
        allowPasswordless: false,
      }),
      nextCookies(),
    ],
  });
}
