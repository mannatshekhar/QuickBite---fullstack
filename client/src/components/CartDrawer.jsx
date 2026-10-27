import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, X, Bike } from 'lucide-react';
import { FREE_DELIVERY_ABOVE, useCart } from '../context/CartContext.jsx';
import { rupee } from '../api.js';
import Stepper from './Stepper.jsx';
import { FoodImage, VegMark } from './FoodCard.jsx';

export default function CartDrawer() {
  const c = useCart();
  const nav = useNavigate();
  if (!c.open) return null;
  const left = FREE_DELIVERY_ABOVE - c.subtotal;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 animate-fadeIn bg-black/50" onClick={() => c.setOpen(false)} />
      <aside className="relative flex h-full w-full max-w-md animate-slideIn flex-col bg-white shadow-2xl" role="dialog" aria-label="Your cart">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
          <h2 className="font-display text-2xl font-bold">My cart</h2>
          <button onClick={() => c.setOpen(false)} className="rounded-lg p-2 hover:bg-stone-100" aria-label="Close cart"><X size={20} /></button>
        </div>

        {c.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-soft text-brand-deep"><ShoppingBag size={32} /></span>
            <p className="font-semibold">Your cart is empty</p>
            <p className="text-sm text-stone-500">Pick something hot from the menu and it will show up here.</p>
            <button className="btn-rust mt-2" onClick={() => { c.setOpen(false); nav('/#menu'); setTimeout(() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }), 50); }}>Browse the menu</button>
          </div>
        ) : (
          <>
            <div className="border-b border-stone-100 bg-brand-soft/50 px-6 py-3 text-sm">
              <p className="flex items-center gap-2"><Bike size={16} className="text-brand-deep" />
                {left > 0 ? <>Add <b>{rupee(left)}</b> more for free delivery</> : <b className="text-green-700">You've unlocked free delivery</b>}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${Math.min(100, (c.subtotal / FREE_DELIVERY_ABOVE) * 100)}%` }} />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-stone-100 overflow-y-auto px-6">
              {c.items.map((i) => (
                <li key={i._id} className="flex gap-4 py-4">
                  <FoodImage src={i.image} alt={i.name} className="h-16 w-16 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2"><VegMark isVeg={i.isVeg} /><p className="truncate font-medium">{i.name}</p></div>
                    <p className="text-sm text-stone-500">{rupee(i.price)} each</p>
                    <div className="mt-2"><Stepper small qty={i.qty} onInc={() => c.inc(i._id)} onDec={() => c.dec(i._id)} /></div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <span className="font-semibold">{rupee(i.price * i.qty)}</span>
                    <button onClick={() => c.remove(i._id)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50" aria-label={`Remove ${i.name}`}><Trash2 size={16} /></button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t border-stone-100 px-6 py-5 text-sm">
              <Row k="Subtotal" v={rupee(c.subtotal)} />
              <Row k="Delivery fee" v={c.deliveryFee ? rupee(c.deliveryFee) : 'Free'} />
              <Row k="Taxes (5%)" v={rupee(c.tax)} />
              <div className="flex justify-between border-t border-dashed border-stone-200 pt-3 text-lg font-bold"><span>Total</span><span>{rupee(c.total)}</span></div>
              <button className="btn-rust mt-3 w-full !rounded-full !py-3.5 text-base" onClick={() => { c.setOpen(false); nav('/checkout'); }}>Checkout</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

const Row = ({ k, v }) => <div className="flex justify-between text-stone-600"><span>{k}</span><span>{v}</span></div>;
