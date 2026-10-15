import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileUp, 
  FileText, 
  History, 
  Settings, 
  ShieldCheck, 
  Lock,
  Cpu,
  Radio,
  Sparkles,
  Layers
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/', label: 'Overview Dashboard', icon: LayoutDashboard, badge: 'Live' },
    { to: '/scanner/document', label: 'Document Scanner', icon: FileUp, badge: 'PDF/DOCX' },
    { to: '/scanner/text', label: 'Direct Text Scanner', icon: FileText, badge: 'Realtime' },
    { to: '/history', label: 'Audit Registry', icon: History },
    { to: '/settings', label: 'Policy & Rules', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 select-none z-30 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
      <div>
        {/* Logo Banner */}
        <div className="p-5 border-b border-slate-800/70 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-cyan-600 to-indigo-600 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-300/40">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base tracking-tight text-slate-100">
                  GovPII<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Shield</span>
                </h1>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-mono font-semibold tracking-wider uppercase text-cyan-400/90 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.2 rounded">
                  DEFENSE OS
                </span>
                <span className="text-[10px] text-slate-400 font-mono">v2.1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 pt-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 pb-2 font-semibold flex items-center justify-between">
            <span>Security Operations</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `
                    group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-cyan-500/15 via-cyan-500/10 to-transparent text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isActive 
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold' 
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}

                      {/* Active indicator bar on the left */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-r shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Security Telemetry Widget */}
      <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800/80 text-[11px] shadow-lg relative overflow-hidden space-y-2.5">
        <div className="flex items-center justify-between text-slate-300 border-b border-slate-800/80 pb-2">
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-400 font-semibold uppercase">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>Telemetry</span>
          </span>
          <span className="text-[9px] bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
            ACTIVE
          </span>
        </div>

        <div className="space-y-1.5 text-[10px] font-mono text-slate-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>AI Engine</span>
            </span>
            <span className="text-slate-300 font-semibold">Gemini 3.8</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Storage Policy</span>
            </span>
            <span className="text-emerald-400 font-bold">Zero-Raw PII</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-400" />
              <span>PII Schemas</span>
            </span>
            <span className="text-slate-300">8 Categories</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 text-center font-mono">
          ISO 27701 & DPDP Aligned
        </div>
      </div>
    </aside>
  );
}
