import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function RiskBadge({ level = 'LOW', score = null, size = 'md' }) {
  const normalizedLevel = (level || 'LOW').toUpperCase();

  const styles = {
    HIGH: {
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      glow: 'shadow-[0_0_12px_rgba(244,63,94,0.25)]',
      icon: ShieldAlert,
      dot: 'bg-rose-500',
      label: 'HIGH RISK'
    },
    MEDIUM: {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
      icon: AlertTriangle,
      dot: 'bg-amber-500',
      label: 'MEDIUM RISK'
    },
    LOW: {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
      icon: ShieldCheck,
      dot: 'bg-emerald-500',
      label: 'LOW RISK'
    }
  }[normalizedLevel] || {
    bg: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
    glow: '',
    icon: ShieldCheck,
    dot: 'bg-slate-500',
    label: normalizedLevel
  };

  const Icon = styles.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2'
  }[size] || 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border transition-all ${styles.bg} ${styles.glow} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} animate-pulse`} />
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{styles.label}</span>
      {score !== null && (
        <span className="opacity-75 font-mono text-[10px] ml-0.5">({score}/100)</span>
      )}
    </span>
  );
}
