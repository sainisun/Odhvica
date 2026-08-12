import { describe, expect, it } from "vitest";
import { assertFulfilmentTransition, assertOrderTransition, assertPostPurchaseRequest } from "./state-machine";

describe("order lifecycle state machine", () => {
  it("accepts payment-confirmed order and handmade production transitions", () => {
    expect(() => assertOrderTransition("pending_confirmation", "confirmed")).not.toThrow();
    expect(() => assertFulfilmentTransition("unfulfilled", "in_production")).not.toThrow();
    expect(() => assertFulfilmentTransition("in_production", "ready_to_ship")).not.toThrow();
  });
  it("blocks impossible terminal and duplicate post-purchase transitions", () => {
    expect(() => assertOrderTransition("cancelled", "confirmed")).toThrow("Order cannot transition");
    expect(() => assertFulfilmentTransition("delivered", "in_production")).toThrow("Fulfilment cannot transition");
    expect(() => assertPostPurchaseRequest("return_requested", "exchange_requested")).toThrow("already open");
  });
});
