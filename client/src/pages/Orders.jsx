import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import api, { errMsg, rupee } from '../api.js';
import StatusTrack from '../components/StatusTrack.jsx';

export default function Orders() {
  const [params] = useSearchParams();
  const placed = params.get('placed');
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api.get('/orders').then((r) => { setOrders(r.data); setError(''); }).catch((e) => setError(errMsg(e)));
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 8000); return () => clearInterval(t); }, [load]);

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-display text-4xl font-bold">My orders</h1>

      {placed && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-green-50 p-5 text-green-800">
          <CheckCircle2 className="mt-0.5 shrink-0" />
          <div><p className="font-semibold">Order {placed} placed</p><p className="text-sm">The kitchen has it. This page updates by itself as your order moves along.</p></div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {orders === null && !error && <div className="grid place-items-center py-16"><Loader2 className="animate-spin text-stone-400" /></div>}
      {orders && orders.length === 0 && (
        <div className="py-16 text-center"><p className="font-semibold">You haven't placed any orders yet</p><Link to="/#menu" className="btn-rust mt-4">Order something</Link></div>
      )}

      <div className="mt-8 space-y-5">
        {orders?.map((o) => (
          <article key={o._id} className={`rounded-3xl bg-white p-6 shadow-sm ${o.orderNumber === placed ? 'ring-2 ring-brand' : ''}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-semibold">#{o.orderNumber}</h2>
              <time className="text-sm text-stone-500">{new Date(o.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</time>
            </div>
            <div className="my-6"><StatusTrack status={o.status} /></div>
            <ul className="space-y-1 text-sm">
              {o.items.map((i, k) => <li key={k} className="flex justify-between"><span>{i.qty} × {i.name}</span><span className="text-stone-500">{rupee(i.price * i.qty)}</span></li>)}
            </ul>
            <div className="mt-4 flex flex-wrap justify-between gap-2 border-t border-dashed border-stone-200 pt-4 text-sm">
              <span className="text-stone-500">{o.paymentMethod} · {o.paymentStatus}</span>
              <span className="text-base font-bold">Total {rupee(o.total)}</span>
            </div>
            <p className="mt-2 text-xs text-stone-500">Delivering to {o.customer.address}</p>
          </article>
        ))}
      </div>
    </main>
  );
}