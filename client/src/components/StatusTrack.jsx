import { Check } from 'lucide-react';

const STEPS = ['Placed', 'Preparing', 'Out for delivery', 'Delivered'];

export default function StatusTrack({ status }) {
  if (status === 'Cancelled') return <p className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-700">This order was cancelled</p>;
  const idx = STEPS.indexOf(status);
  return (
    <ol className="flex items-start">
      {STEPS.map((s, i) => (
        <li key={s} className="relative flex flex-1 flex-col items-center text-center">
          {i > 0 && <span className={`absolute right-1/2 top-3.5 h-0.5 w-full ${i <= idx ? 'bg-brand-deep' : 'bg-stone-200'}`} />}
          <span className={`relative z-10 grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${i <= idx ? 'bg-brand-deep text-white' : 'bg-stone-200 text-stone-400'} ${i === idx && idx < 3 ? 'ring-4 ring-brand/30' : ''}`}>
            {i <= idx ? <Check size={14} /> : i + 1}
          </span>
          <span className={`mt-2 text-xs ${i <= idx ? 'font-semibold text-stone-800' : 'text-stone-400'}`}>{s}</span>
        </li>
      ))}
    </ol>
  );
}
