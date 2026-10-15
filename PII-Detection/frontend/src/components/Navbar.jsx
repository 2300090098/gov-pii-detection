import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, User, LogOut, FilePlus, Activity, Sparkles, Lock, Cpu } from 'lucide-react';
import { api } from '../services/api.js';

export default function Navbar({ user, onLogout }) {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    api.checkHealth()
      .then(setHealth)
      .catch(() => setHealth({ status: 'OFFLINE' }));
  }, []);

  return (
    <header className="h-16 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-md">
      {/* Left: Security HUD pill */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/30 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-200">
            SENTINEL SHIELD: <span className="text-cyan-400">ACTIVE DEFENSE</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>
      </div>

      {/* Right: Telemetry & Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Quick Scan Action */}
        <Link
          to="/scanner/document"
          className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-500/40 text-cyan-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)]"
        >
          <FilePlus className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Scan</span>
        </Link>

        {/* System Health Indicators */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
            <span className={`w-2 h-2 rounded-full ${health?.status === 'ONLINE' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            <span>API: {health?.status || 'CHECKING'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>{health?.geminiActive ? 'Gemini 3.8' : 'Hybrid AI'}</span>
          </div>
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-bold text-xs shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <User className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-200 leading-tight">
                {user?.displayName || user?.email?.split('@')[0] || 'Security Analyst'}
              </div>
              <div className="text-[10px] text-cyan-400/90 font-mono font-medium">
                {user?.isDemo ? 'Demo Analyst Session' : 'SecOps Level 3'}
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900/80 rounded-xl transition-all border border-transparent hover:border-rose-500/30"
            title="Terminate session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
