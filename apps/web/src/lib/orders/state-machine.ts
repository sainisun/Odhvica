export type OrderStatus = "draft" | "pending_confirmation" | "confirmed" | "cancelled" | "completed" | "archived";
export type FulfilmentStatus = "unfulfilled" | "review_required" | "in_production" | "ready_to_ship" | "partially_fulfilled" | "fulfilled" | "shipped" | "delivered" | "returned";
export type PostPurchaseStatus = "none" | "cancellation_requested" | "return_requested" | "exchange_requested" | "refund_under_review" | "resolved";

const orderTransitions: Record<OrderStatus, readonly OrderStatus[]> = {
  draft: ["pending_confirmation", "cancelled"],
  pending_confirmation: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  cancelled: ["archived"],
  completed: ["archived"],
  archived: [],
};

const fulfilmentTransitions: Record<FulfilmentStatus, readonly FulfilmentStatus[]> = {
  unfulfilled: ["review_required", "in_production", "ready_to_ship", "fulfilled"],
  review_required: ["unfulfilled", "in_production", "ready_to_ship"],
  in_production: ["ready_to_ship", "unfulfilled"],
  ready_to_ship: ["partially_fulfilled", "fulfilled", "shipped"],
  partially_fulfilled: ["fulfilled", "shipped"],
  fulfilled: ["shipped", "delivered"],
  shipped: ["delivered", "returned"],
  delivered: ["returned"],
  returned: [],
};

export function assertOrderTransition(current: OrderStatus, next: OrderStatus) {
  if (!orderTransitions[current].includes(next)) throw new Error(`Order cannot transition from ${current} to ${next}.`);
}

export function assertFulfilmentTransition(current: FulfilmentStatus, next: FulfilmentStatus) {
  if (!fulfilmentTransitions[current].includes(next)) throw new Error(`Fulfilment cannot transition from ${current} to ${next}.`);
}

export function assertPostPurchaseRequest(status: PostPurchaseStatus, requested: Exclude<PostPurchaseStatus, "none" | "resolved">) {
  if (status !== "none") throw new Error("A post-purchase request is already open for this order.");
  if (requested === "cancellation_requested") return;
  if (requested === "return_requested" || requested === "exchange_requested" || requested === "refund_under_review") return;
  throw new Error("Unsupported post-purchase request.");
}
