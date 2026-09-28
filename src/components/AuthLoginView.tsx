'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, Mail, User, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthLoginView: React.FC = () => {
  const { currentUser, users, switchUser, navigate, language } = useStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isUrdu = language === 'ur';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMsg({ type: 'error', text: 'Please provide both email and password.' });
      return;
    }
    const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      switchUser(matched.id);
      setMsg({ type: 'success', text: `Welcome back, ${matched.name}!` });
      setTimeout(() => {
        if (matched.role === 'ADMIN') navigate('admin');
        else if (matched.role === 'EMPLOYEE') navigate('employee');
        else navigate('account');
      }, 700);
    } else {
      // Allow demo sign in as customer
      switchUser(users[0]?.id || null);
      setMsg({ type: 'success', text: 'Signed in successfully!' });
      setTimeout(() => navigate('account'), 700);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setMsg({ type: 'error', text: 'Please complete all required fields.' });
      return;
    }
    // Switch to active customer
    switchUser(users[0]?.id || null);
    setMsg({ type: 'success', text: 'Patron account created successfully!' });
    setTimeout(() => navigate('account'), 700);
  };

  return (
    <div className={`min-h-[70vh] flex items-center justify-center px-4 py-12 ${isUrdu ? 'rtl font-urdu' : 'ltr'}`}>
      <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#FAF9F5] border-b border-stone-200 text-center space-y-1.5">
          <div className="w-10 h-10 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-display font-semibold text-stone-950">
            {isRegister
              ? isUrdu
                ? 'نیا اکاؤنٹ بنائیں'
                : 'Create Patron Account'
              : isUrdu
              ? 'پلیٹ فارم لاگ اِن'
              : 'Sign In to Zauq Luxury'}
          </h1>
          <p className="text-xs text-stone-500">
            {isRegister
              ? isUrdu
                ? 'خصوصی دستکار کلیکشنز اور تیز تر چیک آؤٹ تک رسائی'
                : 'Join our exclusive patronage circle for bespoke privileges.'
              : isUrdu
              ? 'اپنے آرڈرز، پسندیدہ اشیاء اور پتے دیکھنے کے لیے لاگ ان کریں'
              : 'Access your order history, delivery addresses, and private archive.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {msg && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                msg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {msg.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
              <span>{msg.text}</span>
            </div>
          )}

          {isRegister ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isUrdu ? 'پورا نام' : 'Full Name'} *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
                  />
                  <User className="w-4 h-4 absolute right-3 top-3 text-stone-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isUrdu ? 'ای میل ایڈریس' : 'Email Address'} *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@example.com"
                    className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
                  />
                  <Mail className="w-4 h-4 absolute right-3 top-3 text-stone-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isUrdu ? 'موبائل نمبر' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 0000000"
                  className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isUrdu ? 'پاس ورڈ' : 'Password'} *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-stone-950 hover:bg-stone-800 text-white py-3 rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                {isUrdu ? 'رجسٹر کریں' : 'Create Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isUrdu ? 'ای میل ایڈریس' : 'Email Address'} *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ali.ali.ahmad987789@gmail.com"
                    className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
                  />
                  <Mail className="w-4 h-4 absolute right-3 top-3 text-stone-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-stone-700">
                    {isUrdu ? 'پاس ورڈ' : 'Password'} *
                  </label>
                  <span className="text-[11px] text-stone-500 hover:text-stone-900 cursor-pointer">
                    {isUrdu ? 'پاس ورڈ بھول گئے؟' : 'Forgot Password?'}
                  </span>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-stone-950 hover:bg-stone-800 text-white py-3 rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{isUrdu ? 'لاگ ان کریں' : 'Sign In to Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Switch Register/Login */}
          <div className="text-center pt-2 border-t border-stone-100">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setMsg(null);
              }}
              className="text-xs text-stone-600 hover:text-stone-950 underline underline-offset-4 cursor-pointer"
            >
              {isRegister
                ? isUrdu
                  ? 'پہلے سے اکاؤنٹ موجود ہے؟ لاگ ان کریں'
                  : 'Already a patron? Sign in here'
                : isUrdu
                ? 'نیا اکاؤنٹ بنائیں (رجسٹریشن)'
                : 'New to Zauq Luxury? Create an account'}
            </button>
          </div>

          {/* Quick Demo Switchers */}
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 space-y-2 text-xs">
            <span className="font-semibold text-stone-700 block text-[11px] uppercase tracking-wider">
              Quick Test Personas
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    if (u.role === 'ADMIN') navigate('admin');
                    else if (u.role === 'EMPLOYEE') navigate('employee');
                    else navigate('account');
                  }}
                  className={`text-left p-2 rounded border text-[11px] cursor-pointer transition-colors ${
                    currentUser?.id === u.id
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="font-semibold truncate">{u.name}</div>
                  <div className="text-[9px] opacity-75 truncate">{u.role}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
