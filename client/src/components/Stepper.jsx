import { Minus, Plus } from 'lucide-react';

export default function Stepper({ qty, onInc, onDec, small }) {
  const s = small ? 'h-7 w-7' : 'h-9 w-9';
  return (
    <div className="inline-flex items-center gap-2 rounded-xl bg-brand-soft p-1">
      <button onClick={onDec} className={`${s} grid place-items-center rounded-lg bg-white text-brand-deep shadow-sm hover:bg-orange-50`} aria-label="Decrease quantity"><Minus size={14} /></button>
      <span className="w-6 text-center text-sm font-semibold tabular-nums">{qty}</span>
      <button onClick={onInc} className={`${s} grid place-items-center rounded-lg bg-brand-deep text-white hover:bg-orange-800`} aria-label="Increase quantity"><Plus size={14} /></button>
    </div>
  );
}
