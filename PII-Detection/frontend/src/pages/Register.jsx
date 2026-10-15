import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { authService } from '../services/auth.js';

export default function Register({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await authService.register(email, password);
      onAuthSuccess(res.user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Could not register account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccess = () => {
    const res = authService.loginAsDemo();
    onAuthSuccess(res.user);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Brand Banner */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-cyan-600 to-indigo-600 flex items-center justify-center text-slate-950 mx-auto shadow-[0_0_35px_rgba(6,182,212,0.5)] border border-cyan-300/50">
              <ShieldCheck className="w-9 h-9 stroke-[2.5]" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              GovPII<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Shield</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto font-medium">
              Create Authorized Security Analyst Access
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="cyber-card rounded-3xl p-8 shadow-2xl space-y-6 border border-slate-800/90">
          <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-100">Register Analyst Credentials</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Enrolls identity for audit telemetry and protected scanning</p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 rounded-md font-semibold">
              NEW ENROLLMENT
            </span>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3.5 rounded-2xl flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Button */}
          <button
            type="button"
            onClick={handleDemoAccess}
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-extrabold py-3 px-4 rounded-2xl text-xs transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] group cursor-pointer"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5] group-hover:rotate-12 transition-transform" />
            <span>Instant Demo Analyst Mode (Skip Registration)</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Or Register Credentials</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@agency.gov or user@domain.com"
                  className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-cyan-400 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Passphrase
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-cyan-400 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Confirm Passphrase
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter passphrase"
                  className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-cyan-400 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-600 font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Enrolling Account...' : 'Create Credentials'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-3 border-t border-slate-800/80">
            Already registered?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
