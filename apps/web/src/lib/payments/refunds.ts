import { eq } from "drizzle-orm";
import { getDatabase } from "@/lib/db";
import { payments, refunds } from "@/lib/db/schema";
import { createSandboxRefundHandoff } from "./adapter";

type CommerceDatabase = ReturnType<typeof getDatabase>;

/**
 * Builds a deterministic no-network sandbox handoff from an already approved refund.
 * A real provider execution adapter will replace this boundary after live activation.
 */
export async function prepareSandboxRefundHandoff(refundId: string, options: { db?: CommerceDatabase } = {}) {
  const db = options.db ?? getDatabase();
  const [refund] = await db.select().from(refunds).where(eq(refunds.id, refundId)).limit(1);
  if (!refund || refund.status !== "approved") throw new Error("Only an approved refund can enter sandbox processing.");
  const [payment] = await db.select().from(payments).where(eq(payments.id, refund.paymentId)).limit(1);
  if (!payment) throw new Error("Refund payment record was not found.");
  return createSandboxRefundHandoff({ refundId: refund.id, provider: payment.provider, amount: Number(refund.amount), currency: refund.currency });
}
