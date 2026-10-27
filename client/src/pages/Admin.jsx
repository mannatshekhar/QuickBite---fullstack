import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ClipboardList, Flame, LayoutDashboard, Loader2, LogOut, Plus, Trash2, UtensilsCrossed } from 'lucide-react';
import api, { adminHeaders, errMsg, rupee } from '../api.js';
import { FoodImage, VegMark } from '../components/FoodCard.jsx';

const STATUSES = ['Placed', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled'];
const BADGE = { Placed: 'bg-blue-50 text-blue-700', Preparing: 'bg-amber-50 text-amber-700', 'Out for delivery': 'bg-purple-50 text-purple-700', Delivered: 'bg-green-50 text-green-700', Cancelled: 'bg-red-50 text-red-700' };
const EMPTY = { name: '', description: '', price: '', category: '', image: '', isVeg: true, featured: false, prepTime: 20 };

export default function Admin() {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem('qb_admin'));
  const [tab, setTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [o, f] = await Promise.all([api.get('/orders/admin/all', { headers: adminHeaders() }), api.get('/foods', { params: { all: true } })]);
      setOrders(o.data); setFoods(f.data); setError('');
    } catch (e) {
      if (e?.response?.status === 401) { sessionStorage.removeItem('qb_admin'); setAuthed(false); }
      setError(errMsg(e));
    }
  }, []);

  useEffect(() => { if (authed) { load(); const t = setInterval(load, 10000); return () => clearInterval(t); } }, [authed, load]);

  if (!authed) return <Gate onOk={() => setAuthed(true)} error={error} />;

  const revenue = orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0);
  const active = orders.filter((o) => ['Placed', 'Preparing', 'Out for delivery'].includes(o.status)).length;
  const nav = [['overview', 'Overview', LayoutDashboard], ['orders', 'Orders', ClipboardList], ['dishes', 'Dishes', UtensilsCrossed]];

  return (
    <div className="flex min-h-screen bg-stone-100">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-stone-200 bg-white p-5 md:flex">
        <Link to="/" className="mb-8 flex items-center gap-2 font-display text-xl font-bold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-night"><Flame size={20} /></span>QuickBite</Link>
        {nav.map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} className={`mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium ${tab === id ? 'bg-brand-soft text-brand-deep' : 'text-stone-600 hover:bg-stone-50'}`}><Icon size={18} />{label}</button>
        ))}
        <button onClick={() => { sessionStorage.removeItem('qb_admin'); setAuthed(false); }} className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-stone-500 hover:bg-stone-50"><LogOut size={18} />Lock admin</button>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{nav.find((n) => n[0] === tab)[1]}</h1>
          <Link to="/" className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 md:hidden"><ArrowLeft size={14} /> Store</Link>
        </div>
        <div className="mb-5 flex gap-2 md:hidden">{nav.map(([id, l]) => <button key={id} onClick={() => setTab(id)} className={`rounded-full px-4 py-1.5 text-sm ${tab === id ? 'bg-brand-deep text-white' : 'bg-white'}`}>{l}</button>)}</div>
        {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Stat label="Total orders" value={orders.length} />
              <Stat label="Revenue" value={rupee(revenue)} icon />
              <Stat label="Active orders" value={active} />
              <Stat label="Dishes on menu" value={foods.length} />
            </div>
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold">Latest orders</h2>
              <OrdersTable orders={orders.slice(0, 6)} onChange={load} />
            </section>
          </div>
        )}
        {tab === 'orders' && <section className="rounded-2xl bg-white p-6 shadow-sm"><OrdersTable orders={orders} onChange={load} /></section>}
        {tab === 'dishes' && <Dishes foods={foods} onChange={load} />}
      </main>
    </div>
  );
}

function Gate({ onOk, error }) {
  const [key, setKey] = useState('');
  const [err, setErr] = useState('');
  const go = async (e) => {
    e.preventDefault();
    sessionStorage.setItem('qb_admin', key);
    try { await api.get('/orders/admin/all', { headers: adminHeaders() }); onOk(); }
    catch (x) { sessionStorage.removeItem('qb_admin'); setErr(errMsg(x)); }
  };
  return (
    <main className="grid min-h-screen place-items-center bg-night p-5">
      <form onSubmit={go} className="w-full max-w-sm rounded-3xl bg-white p-8">
        <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand text-night"><Flame /></span>
        <h1 className="font-display text-2xl font-bold">Admin panel</h1>
        <p className="mt-1 text-sm text-stone-500">Enter the passcode from <code>ADMIN_KEY</code> in server/.env (default: quickbite-admin).</p>
        <input type="password" autoFocus className="input mt-5" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Passcode" aria-label="Admin passcode" />
        {(err || error) && <p role="alert" className="mt-3 text-sm text-red-600">{err || error}</p>}
        <button className="btn-rust mt-5 w-full">Open admin</button>
        <Link to="/" className="mt-4 block text-center text-sm text-stone-500 hover:underline">Back to the store</Link>
      </form>
    </main>
  );
}

const Stat = ({ label, value, icon }) => (
  <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-stone-500">{label}</p><p className="mt-2 flex items-center text-3xl font-bold">{value}</p></div>
);

function OrdersTable({ orders, onChange }) {
  const [busy, setBusy] = useState('');
  const update = async (id, status) => {
    setBusy(id);
    try { await api.patch(`/orders/${id}/status`, { status }, { headers: adminHeaders() }); await onChange(); } finally { setBusy(''); }
  };
  if (!orders.length) return <p className="py-10 text-center text-stone-500">No orders yet. Place one from the store and it appears here.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="text-stone-500"><tr className="border-b border-stone-100"><th className="py-3 font-medium">Order</th><th className="font-medium">Customer</th><th className="font-medium">Items</th><th className="font-medium">Total</th><th className="font-medium">Status</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-b border-stone-50 align-top">
              <td className="py-4"><p className="font-semibold">#{o.orderNumber}</p><p className="text-xs text-stone-400">{new Date(o.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</p></td>
              <td><p>{o.customer.name}</p><p className="text-xs text-stone-500">{o.customer.phone}</p><p className="max-w-[200px] truncate text-xs text-stone-400" title={o.customer.address}>{o.customer.address}</p></td>
              <td className="max-w-[220px] text-stone-600">{o.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}</td>
              <td className="font-semibold">{rupee(o.total)}<p className="text-xs font-normal text-stone-400">{o.paymentMethod}</p></td>
              <td>
                <select value={o.status} disabled={busy === o._id} onChange={(e) => update(o._id, e.target.value)} aria-label={`Status for order ${o.orderNumber}`}
                  className={`rounded-lg border-0 px-3 py-2 text-xs font-semibold ${BADGE[o.status]}`}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Dishes({ foods, onChange }) {
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const add = async (e) => {
    e.preventDefault(); setBusy(true); setMsg('');
    try {
      await api.post('/foods', { ...f, price: Number(f.price), prepTime: Number(f.prepTime) }, { headers: adminHeaders() });
      setF(EMPTY); setMsg('Dish added to the menu'); onChange();
    } catch (x) { setMsg(errMsg(x)); } finally { setBusy(false); }
  };
  const toggle = async (d) => { await api.put(`/foods/${d._id}`, { available: !d.available }, { headers: adminHeaders() }); onChange(); };
  const del = async (d) => { if (confirm(`Delete "${d.name}"?`)) { await api.delete(`/foods/${d._id}`, { headers: adminHeaders() }); onChange(); } };

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <form onSubmit={add} className="h-fit space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold">Add a dish</h2>
        <div><label className="label" htmlFor="d-name">Name</label><input id="d-name" required className="input" value={f.name} onChange={set('name')} /></div>
        <div><label className="label" htmlFor="d-desc">Description</label><textarea id="d-desc" rows={2} className="input" value={f.description} onChange={set('description')} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label" htmlFor="d-price">Price (₹)</label><input id="d-price" required type="number" min="0" className="input" value={f.price} onChange={set('price')} /></div>
          <div><label className="label" htmlFor="d-cat">Category</label><input id="d-cat" required list="cats" className="input" value={f.category} onChange={set('category')} placeholder="Pizza" /></div>
        </div>
        <datalist id="cats">{[...new Set(foods.map((d) => d.category))].map((c) => <option key={c} value={c} />)}</datalist>
        <div><label className="label" htmlFor="d-img">Image URL</label><input id="d-img" type="url" className="input" value={f.image} onChange={set('image')} placeholder="https://…" /></div>
        <div className="flex gap-6 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.isVeg} onChange={set('isVeg')} /> Vegetarian</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.featured} onChange={set('featured')} /> Chef's pick</label>
        </div>
        {msg && <p className="text-sm text-stone-600" role="status">{msg}</p>}
        <button disabled={busy} className="btn-rust w-full">{busy ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} Add dish</button>
      </form>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Menu ({foods.length})</h2>
        <ul className="divide-y divide-stone-100">
          {foods.map((d) => (
            <li key={d._id} className={`flex items-center gap-4 py-3 ${d.available ? '' : 'opacity-50'}`}>
              <FoodImage src={d.image} alt="" className="h-14 w-14 rounded-xl" />
              <div className="min-w-0 flex-1"><p className="flex items-center gap-2 truncate font-medium"><VegMark isVeg={d.isVeg} />{d.name}</p><p className="text-sm text-stone-500">{d.category} · {rupee(d.price)}</p></div>
              <button onClick={() => toggle(d)} className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium hover:bg-stone-50">{d.available ? 'Hide' : 'Show'}</button>
              <button onClick={() => del(d)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${d.name}`}><Trash2 size={16} /></button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
