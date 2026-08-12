import { toNextJsHandler } from "better-auth/next-js";
import { createAuth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return toNextJsHandler(createAuth()).GET(request);
}

export async function POST(request: Request) {
  return toNextJsHandler(createAuth()).POST(request);
}
