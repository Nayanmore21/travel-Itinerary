import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const FEATURES = [
  'AI reads your travel documents instantly',
  'Day-by-day itinerary in under 30 seconds',
  'Share via link, QR code or PDF export',
];

const DESTINATIONS = [
  { city: 'Paris',   country: 'France',    flag: '🇫🇷', days: 5 },
  { city: 'Tokyo',   country: 'Japan',     flag: '🇯🇵', days: 7 },
  { city: 'Bali',    country: 'Indonesia', flag: '🇮🇩', days: 6 },
];

const STATS = [
  { value: '50K+',  label: 'Trips Planned'   },
  { value: '4.9★',  label: 'User Rating'     },
  { value: '< 30s', label: 'Itinerary Ready' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] } },
});

const HeroPanel = () => (
  <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex-col justify-between p-12 xl:p-16">

    {/* Glow orbs */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
      <div className="absolute top-1/2 -right-24 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />

      {/* Dot grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>

    {/* Top content */}
    <div className="relative z-10">
      {/* Logo */}
      <motion.div {...fadeUp(0)} className="mb-12 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/40">
          <Plane className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">TripCraft</span>
      </motion.div>

      {/* Headline */}
      <motion.h1 {...fadeUp(0.08)} className="mb-4 text-4xl xl:text-5xl font-bold leading-tight text-white">
        Turn your bookings<br />
        into a{' '}
        <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
          perfect journey
        </span>
      </motion.h1>

      <motion.p {...fadeUp(0.16)} className="mb-10 max-w-sm text-base leading-relaxed text-blue-200/75">
        Upload your flight tickets and hotel confirmations. Our AI builds your complete itinerary in seconds.
      </motion.p>

      {/* Feature list */}
      <div className="mb-10 space-y-3">
        {FEATURES.map((f, i) => (
          <motion.div key={f} {...fadeUp(0.22 + i * 0.07)} className="flex items-center gap-3">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-blue-400" />
            <span className="text-sm text-blue-100/85">{f}</span>
          </motion.div>
        ))}
      </div>

      {/* Destination cards */}
      <motion.div {...fadeUp(0.46)} className="flex flex-wrap gap-3">
        {DESTINATIONS.map((d) => (
          <div
            key={d.city}
            className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/8 px-4 py-2.5 backdrop-blur-sm"
          >
            <span className="text-xl leading-none">{d.flag}</span>
            <div>
              <p className="text-sm font-semibold leading-none text-white">{d.city}</p>
              <p className="mt-0.5 text-xs text-blue-300/70">{d.days} days</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>

    {/* Stats bar */}
    <motion.div {...fadeUp(0.55)} className="relative z-10">
      <div className="flex overflow-hidden rounded-2xl border border-white/10 bg-white/6 backdrop-blur-sm">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`flex-1 py-4 text-center ${i < STATS.length - 1 ? 'border-r border-white/10' : ''}`}
          >
            <p className="text-lg font-bold text-white">{s.value}</p>
            <p className="mt-0.5 text-xs text-blue-300/60">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const { loginMutation } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(form);
  };

  return (
    <div className="flex min-h-screen">
      <HeroPanel />

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-white p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile-only logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <Plane className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TripCraft</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-500">Sign in to continue planning your trips</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-12 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="h-12 w-full rounded-xl bg-blue-600 text-base font-semibold shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-blue-600/40"
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            >
              Create one free
            </Link>
          </p>

          {/* Mobile feature list */}
          <div className="mt-10 border-t border-gray-100 pt-8 lg:hidden">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-gray-400">
              Why TripCraft
            </p>
            <div className="space-y-2.5">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500" />
                  <span className="text-xs text-gray-500">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
