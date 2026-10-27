import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

// Keep in sync with server/pricing.js
export const DELIVERY_FEE = 40;
export const FREE_DELIVERY_ABOVE = 499;
export const TAX_RATE = 0.05;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qb_cart')) || []; } catch { return []; }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => { localStorage.setItem('qb_cart', JSON.stringify(items)); }, [items]);

  const add = (food) =>
    setItems((prev) => {
      const found = prev.find((i) => i._id === food._id);
      if (found) return prev.map((i) => (i._id === food._id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { _id: food._id, name: food.name, price: food.price, image: food.image, isVeg: food.isVeg, qty: 1 }];
    });
  const inc = (id) => setItems((p) => p.map((i) => (i._id === id ? { ...i, qty: Math.min(20, i.qty + 1) } : i)));
  const dec = (id) => setItems((p) => p.flatMap((i) => (i._id !== id ? [i] : i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : [])));
  const remove = (id) => setItems((p) => p.filter((i) => i._id !== id));
  const clear = () => setItems([]);

  const value = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const count = items.reduce((s, i) => s + i.qty, 0);
    const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;
    return { items, count, subtotal, deliveryFee, tax, total, add, inc, dec, remove, clear, open, setOpen };
  }, [items, open]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
