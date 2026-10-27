import { useEffect, useMemo, useState } from 'react';
import { Bike, ChefHat, Search, Star, Utensils, Leaf, Loader2, AlertTriangle } from 'lucide-react';
import api, { errMsg } from '../api.js';
import FoodCard from '../components/FoodCard.jsx';
import { FREE_DELIVERY_ABOVE } from '../context/CartContext.jsx';

const HERO_IMG = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80';

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [category, setCategory] = useState('All');
  const [veg, setVeg] = useState(false);

  useEffect(() => { const t = setTimeout(() => setDebounced(q), 250); return () => clearTimeout(t); }, [q]);

  const load = () => {
    setLoading(true); setError('');
    api.get('/foods').then((r) => setFoods(r.data)).catch((e) => setError(errMsg(e))).finally(() => setLoading(false));
  };
  useEffect(load, []);

  useEffect(() => {
    if (window.location.hash === '#menu') setTimeout(() => document.getElementById('menu')?.scrollIntoView(), 100);
  }, [loading]);

  const categories = useMemo(() => ['All', ...new Set(foods.map((f) => f.category))], [foods]);
  const filtered = useMemo(() => foods.filter((f) =>
    (category === 'All' || f.category === category) &&
    (!veg || f.isVeg) &&
    (!debounced || `${f.name} ${f.description} ${f.category}`.toLowerCase().includes(debounced.toLowerCase()))
  ), [foods, category, veg, debounced]);
  const featured = foods.filter((f) => f.featured).slice(0, 4);
  const filtering = category !== 'All' || veg || debounced;

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-night text-white">
        <div className="pointer-events-none absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-brand/20 blur-[120px]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-14 md:grid-cols-2 md:pt-20">
          <div>
            <h1 className="font-display text-5xl font-bold leading-[1.05] sm:text-6xl">
              Hot food at your door,<br />
              <span className="relative inline-block">in under 30 minutes.
                <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none"><path d="M2 8 C 80 2, 190 2, 298 7" stroke="#F58A07" strokeWidth="3" strokeLinecap="round" /></svg>
              </span>
            </h1>
            <p className="mt-8 max-w-md text-lg text-white/70">Burgers, biryani, pizza and more from kitchens near you. Order in a few taps and watch it go from kitchen to doorstep.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#menu" className="btn-brand"><Search size={18} /> Find your meal</a>
              <a href="/orders" className="btn-ghost"><Bike size={18} /> Track an order</a>
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm text-white/70">
              <div className="flex -space-x-2">
                {['#F58A07', '#C2410C', '#FDBA74', '#9A3412'].map((c, i) => <span key={i} className="h-8 w-8 rounded-full border-2 border-night" style={{ background: c }} />)}
              </div>
              <span>Loved by <b className="text-white">5,000+</b> hungry people</span>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl shadow-brand/10">
              <img src={HERO_IMG} alt="Smash cheese burger" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-5 left-4 rounded-2xl border border-white/10 bg-night/90 px-5 py-4 backdrop-blur sm:left-[-1.5rem]">
              <p className="text-sm text-white/60">Customer rating</p>
              <p className="flex items-center gap-1.5 text-2xl font-bold">4.8 <Star size={18} className="text-brand" fill="currentColor" /></p>
            </div>
          </div>
        </div>
        <div className="relative border-t border-white/10">
          <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:grid-cols-3">
            {[[Bike, 'Fast delivery', 'Under 30 minutes on most orders'], [ChefHat, 'Fresh from the kitchen', 'Cooked when you order, never reheated'], [Utensils, `Free delivery over ₹${FREE_DELIVERY_ABOVE}`, 'Otherwise a flat ₹40']].map(([Icon, t, d]) => (
              <div key={t} className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand"><Icon size={24} /></span>
                <div><p className="font-semibold">{t}</p><p className="text-sm text-white/55">{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-4xl font-bold">What are you craving?</h2>
          <div className="flex gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes" className="input !pl-11" aria-label="Search dishes" />
            </div>
            <button onClick={() => setVeg(!veg)} aria-pressed={veg}
              className={`btn shrink-0 border ${veg ? 'border-green-600 bg-green-600 text-white' : 'border-stone-200 bg-white text-stone-700 hover:border-green-600'}`}>
              <Leaf size={16} /> Veg only
            </button>
          </div>
        </div>

        <div className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition ${category === c ? 'border-brand-deep bg-brand-deep text-white' : 'border-stone-300 bg-white hover:border-brand-deep'}`}>
              {c}
            </button>
          ))}
        </div>

        {loading && <div className="grid place-items-center py-24 text-stone-500"><Loader2 className="animate-spin" /><p className="mt-2 text-sm">Loading the menu…</p></div>}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
            <p className="flex items-center gap-2 font-semibold"><AlertTriangle size={18} /> Can't reach the server</p>
            <p className="mt-1 text-sm">{error}. Make sure the backend is running on port 5000 and MongoDB Atlas is connected.</p>
            <button onClick={load} className="btn-rust mt-4 !py-2">Try again</button>
          </div>
        )}

        {!loading && !error && !filtering && featured.length > 0 && (
          <div className="mt-10">
            <h3 className="mb-4 text-xl font-semibold">Chef's picks</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{featured.map((f) => <FoodCard key={'f' + f._id} food={f} />)}</div>
            <h3 className="mb-4 mt-12 text-xl font-semibold">Full menu</h3>
          </div>
        )}

        {!loading && !error && (
          filtered.length ? (
            <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ${filtering || !featured.length ? 'mt-8' : ''}`}>
              {filtered.map((f) => <FoodCard key={f._id} food={f} />)}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold">Nothing matches that search</p>
              <p className="text-stone-500">Try a different word, or clear the filters.</p>
              <button className="btn-rust mt-4" onClick={() => { setQ(''); setCategory('All'); setVeg(false); }}>Clear filters</button>
            </div>
          )
        )}
      </section>

      <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-500">QuickBite · A MERN stack demo project · Payments are simulated</footer>
    </main>
  );
}
