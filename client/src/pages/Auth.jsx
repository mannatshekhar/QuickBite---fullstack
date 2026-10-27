import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Flame, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../api.js';

export default function Auth() {
  const { user, login, signup } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') || '/';
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => { if (user) nav(next, { replace: true }); }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await signup(form);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  const signupMode = mode === 'signup';
  return (
    <main className="mx-auto grid max-w-md px-5 py-14">
      <form onSubmit={submit} className="space-y-4 rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgba(120,53,15,.12)]">
        <Link to="/" className="mb-2 grid h-12 w-12 place-items-center rounded-xl bg-brand text-night" aria-label="QuickBite home"><Flame /></Link>
        <h1 className="font-display text-3xl font-bold">{signupMode ? 'Create your account' : 'Welcome back'}</h1>
        <p className="text-sm text-stone-500">{signupMode ? 'Save your address and track every order in one place.' : 'Sign in to check out and track your orders.'}</p>

        {signupMode && (
          <div><label className="label" htmlFor="a-name">Full name</label><input id="a-name" required className="input" value={form.name} onChange={set('name')} autoComplete="name" /></div>
        )}
        <div><label className="label" htmlFor="a-email">Email</label><input id="a-email" type="email" required className="input" value={form.email} onChange={set('email')} autoComplete="email" /></div>
        {signupMode && (
          <div><label className="label" htmlFor="a-phone">Phone (optional)</label><input id="a-phone" className="input" value={form.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" /></div>
        )}
        <div><label className="label" htmlFor="a-pass">Password</label><input id="a-pass" type="password" required minLength={6} className="input" value={form.password} onChange={set('password')} autoComplete={signupMode ? 'new-password' : 'current-password'} placeholder="At least 6 characters" /></div>

        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="btn-rust w-full !py-3.5">
          {busy && <Loader2 className="animate-spin" size={16} />} {signupMode ? 'Create account' : 'Sign in'}
        </button>
        <p className="text-center text-sm text-stone-600">
          {signupMode ? 'Already have an account?' : 'New to QuickBite?'}{' '}
          <button type="button" onClick={() => { setMode(signupMode ? 'login' : 'signup'); setError(''); }} className="font-semibold text-brand-deep underline">
            {signupMode ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </form>
    </main>
  );
}