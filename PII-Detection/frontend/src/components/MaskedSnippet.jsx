import React, { useState } from 'react';
import { EyeOff, Copy, Check, Lock } from 'lucide-react';

export default function MaskedSnippet({ snippet, maskedValue, category }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(maskedValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Highlight maskedValue in the snippet
  const parts = snippet ? snippet.split(maskedValue) : [''];

  return (
    <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 font-mono text-xs text-slate-300 relative group overflow-hidden">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 font-sans font-semibold text-cyan-400">
          <Lock className="w-3 h-3 text-cyan-400" />
          <span>Redacted Context Window</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
            {category}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-cyan-400 transition-colors bg-slate-800/80 px-2 py-0.5 rounded text-[10px]"
            title="Copy masked placeholder"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="leading-relaxed break-words whitespace-pre-wrap">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <span>{part}</span>
            {index < parts.length - 1 && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold tracking-wider">
                <EyeOff className="w-2.5 h-2.5" />
                {maskedValue}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
