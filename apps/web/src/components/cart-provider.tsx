"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type BrowserCartItem = {
  lineId: string;
  productId: string;
  productSlug: string;
  title: string;
  image: string;
  variantId: string;
  variantTitle: string;
  unitPrice: number;
  quantity: number;
  customisationNote?: string;
};

type CartContextValue = {
  items: BrowserCartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<BrowserCartItem, "lineId" | "quantity">) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "odhvica-browser-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BrowserCartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const restore = window.setTimeout(() => {
      try { setItems(JSON.parse(window.localStorage.getItem(storageKey) ?? "[]")); } catch { setItems([]); } finally { setHydrated(true); }
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);
  useEffect(() => { if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify(items)); }, [items, hydrated]);
  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    addItem: (item) => setItems((current) => {
      const existing = current.find((line) => line.variantId === item.variantId && line.customisationNote === item.customisationNote);
      return existing ? current.map((line) => line.lineId === existing.lineId ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { ...item, lineId: crypto.randomUUID(), quantity: 1 }];
    }),
    updateQuantity: (lineId, quantity) => setItems((current) => quantity <= 0 ? current.filter((line) => line.lineId !== lineId) : current.map((line) => line.lineId === lineId ? { ...line, quantity: Math.min(10, quantity) } : line)),
    removeItem: (lineId) => setItems((current) => current.filter((line) => line.lineId !== lineId)),
    clear: () => setItems([]),
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
