import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Banknote, CreditCard, Loader2 } from 'lucide-react';
import api, { errMsg, rupee } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { FoodImage } from '../components/FoodCard.jsx';

const PAY = [['COD', 'Cash on delivery', Banknote], ['Online', 'Pay online (UPI, Cards, Netbanking)', CreditCard]];

const loadRazorpay = () => new Promise((resolve, reject) => {
  if (window.Razorpay) return resolve();
  const s = document.createElement('script');
  s.src = 'https://checkout.razorpay.com/v1/checkout.js';
  s.onload = resolve;
  s.onerror = () => reject(new Error('Could not load Razorpay. Check your internet connection.'));
  document.body.appendChild(s);
});

export default function Checkout() {
  const c = useCart();
  const nav = useNavigate();
    const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '', notes: '' });
  const [pay, setPay] = useState('COD');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(null); // saved online order waiting for payment
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  if (c.items.length === 0)
    return (
      <main className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-stone-500">Add a few dishes before checking out.</p>
        <Link to="/#menu" className="btn-rust mt-6">Browse the menu</Link>
      </main>
    );

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      let order = pay === 'Online' ? pending : null;
      if (!order) {
        const { data } = await api.post('/orders', {
          items: c.items.map((i) => ({ foodId: i._id, qty: i.qty })),
          customer: form,
          paymentMethod: pay,
        });
        order = data;
                api.put('/auth/me', { phone: form.phone, address: form.address }).catch(() => {}); // remember for next time
        if (pay === 'Online') setPending(data);
      }
      if (pay === 'Online') {
        await loadRazorpay();
        const { data: rp } = await api.post('/payments/create', { orderId: order._id });
        await new Promise((resolve, reject) => {
          const rzp = new window.Razorpay({
            key: rp.keyId, amount: rp.amount, currency: rp.currency, order_id: rp.razorpayOrderId,
            name: 'QuickBite', description: `Order ${rp.orderNumber}`,
            prefill: { name: form.name, contact: form.phone },
            theme: { color: '#C2410C' },
            handler: async (resp) => {
              try { await api.post('/payments/verify', { orderId: order._id, ...resp }); resolve(); } catch (err) { reject(err); }
            },
            modal: { ondismiss: () => reject(new Error('Payment was not completed. Your order is saved. Tap "Pay now" to try again.')) },
          });
          rzp.open();
        });
      }
      c.clear();
      nav(`/orders?placed=${order.orderNumber}`);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-5 py-10 lg:grid-cols-[1fr_380px]">
      <form onSubmit={submit} className="space-y-6">
        <h1 className="font-display text-4xl font-bold">Checkout</h1>
        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Delivery details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label" htmlFor="name">Full name</label><input id="name" required className="input" value={form.name} onChange={set('name')} autoComplete="name" /></div>
            <div><label className="label" htmlFor="phone">Phone number</label><input id="phone" required className="input" value={form.phone} onChange={set('phone')} inputMode="tel" placeholder="9876543210" autoComplete="tel" /></div>
          </div>
          <div><label className="label" htmlFor="address">Delivery address</label><textarea id="address" required rows={3} className="input" value={form.address} onChange={set('address')} placeholder="Flat, building, street, area, landmark" /></div>
          <div><label className="label" htmlFor="notes">Note for the kitchen (optional)</label><input id="notes" className="input" value={form.notes} onChange={set('notes')} placeholder="Less spicy, no onions…" /></div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Payment</h2>
          <p className="text-sm text-stone-500">Online payments run in Razorpay test mode, so no real money is charged.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {PAY.map(([id, label, Icon]) => (
              <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${pay === id ? 'border-brand-deep bg-brand-soft/60' : 'border-stone-200 hover:border-stone-300'}`}>
                <input type="radio" name="pay" className="sr-only" checked={pay === id} onChange={() => setPay(id)} />
                <Icon size={20} className="text-brand-deep" /><span className="font-medium">{label}</span>
              </label>
            ))}
          </div>
        </section>

        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="btn-rust w-full !rounded-full !py-4 text-base">
          {busy ? <><Loader2 className="animate-spin" size={18} /> Placing order…</> : `${pay === 'Online' ? (pending ? 'Pay now' : 'Pay online') : 'Place order'} · ${rupee(c.total)}`}
        </button>
      </form>

      <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <ul className="mt-4 divide-y divide-stone-100">
          {c.items.map((i) => (
            <li key={i._id} className="flex items-center gap-3 py-3">
              <FoodImage src={i.image} alt="" className="h-12 w-12 rounded-lg" />
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{i.name}</p><p className="text-xs text-stone-500">Qty {i.qty}</p></div>
              <span className="text-sm font-semibold">{rupee(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-2 border-t border-dashed border-stone-200 pt-4 text-sm text-stone-600">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{rupee(c.subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Delivery fee</dt><dd>{c.deliveryFee ? rupee(c.deliveryFee) : 'Free'}</dd></div>
          <div className="flex justify-between"><dt>Taxes (5%)</dt><dd>{rupee(c.tax)}</dd></div>
          <div className="flex justify-between border-t border-stone-100 pt-3 text-lg font-bold text-stone-900"><dt>Total</dt><dd>{rupee(c.total)}</dd></div>
        </dl>
      </aside>
    </main>
  );
}