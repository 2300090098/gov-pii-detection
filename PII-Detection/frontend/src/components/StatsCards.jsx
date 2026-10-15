import React from 'react';
import { Files, ShieldAlert, AlertTriangle, ShieldCheck, Activity, TrendingUp, Sparkles } from 'lucide-react';

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Documents Scanned',
      value: stats?.totalScans ?? 0,
      icon: Files,
      color: 'cyan',
      textColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      glow: 'group-hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]',
      gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
      barColor: 'bg-cyan-400',
      description: 'Total processed workloads',
      badge: 'Active Workloads'
    },
    {
      title: 'Potential PII Findings',
      value: stats?.totalDetections ?? 0,
      icon: Activity,
      color: 'indigo',
      textColor: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/30',
      glow: 'group-hover:shadow-[0_0_25px_rgba(99,102,241,0.2)]',
      gradient: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
      barColor: 'bg-indigo-400',
      description: 'Masked entity occurrences',
      badge: 'Zero-Storage'
    },
    {
      title: 'High Risk Workloads',
      value: stats?.highRiskScans ?? 0,
      icon: ShieldAlert,
      color: 'rose',
      textColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      glow: 'group-hover:shadow-[0_0_25px_rgba(244,63,94,0.2)]',
      gradient: 'from-rose-500/20 via-rose-500/5 to-transparent',
      barColor: 'bg-rose-500',
      description: 'Government IDs flagged',
      badge: 'Requires Redaction'
    },
    {
      title: 'Medium Risk Scans',
      value: stats?.mediumRiskScans ?? 0,
      icon: AlertTriangle,
      color: 'amber',
      textColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      glow: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]',
      gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
      barColor: 'bg-amber-400',
      description: 'Personal contact records',
      badge: 'Audit Advised'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`cyber-card rounded-2xl p-5 relative overflow-hidden group transition-all duration-300 border ${card.borderColor} ${card.glow}`}
          >
            {/* Ambient background light */}
            <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${card.gradient} rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                  {card.title}
                </span>
                <div className={`w-10 h-10 rounded-xl ${card.bgColor} ${card.borderColor} border flex items-center justify-center ${card.textColor} shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
                  {card.value.toLocaleString()}
                </h3>
              </div>

              {/* Progress bar line */}
              <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${card.barColor} transition-all duration-700`}
                  style={{ width: `${Math.min(100, Math.max(15, card.value * 12))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>{card.description}</span>
                <span className="font-mono text-[9px] bg-slate-800/90 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700/60">
                  {card.badge}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
