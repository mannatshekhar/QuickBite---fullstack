import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Flame, LogOut, User } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { count, setOpen } = useCart();
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const dark = pathname === '/';
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const link = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'text-brand' : dark ? 'text-white/80 hover:text-white' : 'text-stone-600 hover:text-stone-900'}`;
  const hover = dark ? 'hover:bg-white/10' : 'hover:bg-stone-100';

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md ${dark ? 'bg-night/80 text-white' : 'bg-cream/90 border-b border-stone-200'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" onClick={toTop} className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-night"><Flame size={20} /></span>
          QuickBite
        </Link>
        <nav className="hidden items-center gap-1 sm:flex">
          <NavLink to="/" end className={link} onClick={toTop}>Home</NavLink>
          <a href="/#menu" onClick={(e) => { const m = document.getElementById('menu'); if (m) { e.preventDefault(); m.scrollIntoView({ behavior: 'smooth' }); } }} className={`rounded-lg px-3 py-2 text-sm font-medium ${dark ? 'text-white/80 hover:text-white' : 'text-stone-600 hover:text-stone-900'}`}>Menu</a>
          <NavLink to="/orders" className={link}>My orders</NavLink>
          <NavLink to="/admin" className={link}>Admin</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/orders" className={`hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium sm:flex ${hover}`}><User size={16} />{user.name.split(' ')[0]}</Link>
              <button onClick={() => { logout(); nav('/'); }} className={`rounded-lg p-2 ${hover}`} aria-label="Sign out" title="Sign out"><LogOut size={18} /></button>
            </>
          ) : (
            <Link to="/login" className={`rounded-lg px-3 py-2 text-sm font-medium ${hover}`}>Sign in</Link>
          )}
          <button onClick={() => setOpen(true)} className="btn-brand relative !px-4 !py-2.5" aria-label={`Open cart, ${count} items`}>
            <ShoppingBag size={18} /> Cart
            {count > 0 && (
              <span key={count} className="absolute -right-2 -top-2 grid h-6 min-w-6 animate-bump place-items-center rounded-full bg-brand-deep px-1 text-xs font-semibold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}