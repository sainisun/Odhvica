import { trackingUpdateSchema } from "./service";

export type CourierAdapter = { provider: string; mode: "sandbox"; createLabel: (input: { orderId: string; destinationCountry: string }) => Promise<{ labelUrl: null; manualFulfilmentRequired: true; reference: string }>; verifyAndNormalizeEvent: (payload: unknown) => ReturnType<typeof trackingUpdateSchema.parse> };
export function createSandboxCourierAdapter(provider = "manual_sandbox"): CourierAdapter { return { provider, mode: "sandbox", async createLabel(input) { return { labelUrl: null, manualFulfilmentRequired: true, reference: `manual_${input.orderId}` }; }, verifyAndNormalizeEvent(payload) { return trackingUpdateSchema.parse(payload); } }; }
