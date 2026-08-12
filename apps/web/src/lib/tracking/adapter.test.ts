import { describe, expect, it } from "vitest";
import { createSandboxCourierAdapter } from "./adapter";
describe("sandbox courier adapter", () => { it("requires manual fulfilment rather than creating a live label", async () => { const adapter = createSandboxCourierAdapter(); await expect(adapter.createLabel({ orderId: "00000000-0000-4000-8000-000000000001", destinationCountry: "IN" })).resolves.toMatchObject({ labelUrl: null, manualFulfilmentRequired: true }); }); });
