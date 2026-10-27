import { Clock, Plus, Star } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { rupee } from '../api.js';
import Stepper from './Stepper.jsx';

export function VegMark({ isVeg }) {
  const c = isVeg ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600';
  return (
    <span className={`grid h-5 w-5 place-items-center rounded-sm border-2 bg-white ${c}`} title={isVeg ? 'Vegetarian' : 'Non-vegetarian'}>
      <span className="h-2 w-2 rounded-full bg-current" />
    </span>
  );
}

export function FoodImage({ src, alt, className = '' }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23FFEBD2"/><text x="50%" y="55%" font-size="72" text-anchor="middle">🍽️</text></svg>'; }}
      className={`object-cover ${className}`}
    />
  );
}

export default function FoodCard({ food }) {
  const { items, add, inc, dec } = useCart();
  const inCart = items.find((i) => i._id === food._id);

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_2px_16px_rgba(120,53,15,.08)] transition hover:shadow-[0_8px_30px_rgba(120,53,15,.15)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <FoodImage src={food.image} alt={food.name} className="h-full w-full transition duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3"><VegMark isVeg={food.isVeg} /></div>
        {food.featured && <span className="absolute right-3 top-3 rounded-full bg-night/80 px-2.5 py-1 text-xs font-medium text-brand">Chef's pick</span>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug">{food.name}</h3>
          <span className="flex shrink-0 items-center gap-1 rounded-md bg-green-50 px-1.5 py-0.5 text-xs font-semibold text-green-700"><Star size={11} fill="currentColor" />{food.rating}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-stone-500">{food.description}</p>
        <p className="mt-2 flex items-center gap-1 text-xs text-stone-400"><Clock size={12} /> {food.prepTime} min · {food.category}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-bold">{rupee(food.price)}</span>
          {inCart ? (
            <Stepper qty={inCart.qty} onInc={() => inc(food._id)} onDec={() => dec(food._id)} />
          ) : (
            <button onClick={() => add(food)} className="btn-rust !px-4 !py-2" aria-label={`Add ${food.name} to cart`}><Plus size={16} /> Add</button>
          )}
        </div>
      </div>
    </article>
  );
}
