import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Bot, Cpu, ShieldAlert, Check, Copy, Eye, Lock } from 'lucide-react';
import MaskedSnippet from './MaskedSnippet.jsx';
import RiskBadge from './RiskBadge.jsx';

export default function PiiTable({ detections = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const categories = ['ALL', ...new Set(detections.map(d => d.category))];

  const filteredDetections = detections.filter(d => {
    const matchesSearch = 
      d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.maskedValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.contextSnippet && d.contextSnippet.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || d.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCopy = (val, id) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderSourceBadge = (source) => {
    if (source === 'gemini_verified') {
      return (
        <span className="inline-flex items-center gap-1.5 text-[10px] bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 px-2.5 py-1 rounded-full font-mono font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]">
          <Bot className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>Gemini 3.8</span>
        </span>
      );
    }
    if (source === 'pattern_and_context') {
      return (
        <span className="inline-flex items-center gap-1.5 text-[10px] bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 px-2.5 py-1 rounded-full font-mono font-semibold">
          <Cpu className="w-3 h-3 text-indigo-400" />
          <span>NLP Context</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] bg-slate-800/90 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-full font-mono">
        <Cpu className="w-3 h-3 text-slate-400" />
        <span>Pattern</span>
      </span>
    );
  };

  return (
    <div className="cyber-card rounded-3xl overflow-hidden shadow-2xl border border-slate-800/90">
      {/* Search and Filters Header */}
      <div className="p-5 border-b border-slate-800/80 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-950/50">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search category, masked value, or context snippet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-mono text-slate-400">Category Filter:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 px-3 py-2 focus:outline-none focus:border-cyan-400"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-5">#</th>
              <th className="py-3.5 px-5">Identified Category</th>
              <th className="py-3.5 px-5">Redacted Entity (Masked)</th>
              <th className="py-3.5 px-5">Confidence Score</th>
              <th className="py-3.5 px-5">Detection Engine</th>
              <th className="py-3.5 px-5">Risk Weight</th>
              <th className="py-3.5 px-5 text-right">Context Inspection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredDetections.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-500">
                  <Lock className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p className="text-slate-400 font-medium">No matching PII records found for this query.</p>
                </td>
              </tr>
            ) : (
              filteredDetections.map((item, index) => {
                const isExpanded = expandedId === item.id;
                const confidencePct = Math.round((item.confidence || 0.7) * 100);

                return (
                  <React.Fragment key={item.id || index}>
                    <tr
                      onClick={() => toggleExpand(item.id)}
                      className={`hover:bg-slate-850/60 cursor-pointer transition-colors duration-150 ${
                        isExpanded ? 'bg-slate-900/90 border-l-2 border-l-cyan-400' : ''
                      }`}
                    >
                      <td className="py-4 px-5 text-slate-500 font-mono">{index + 1}</td>
                      <td className="py-4 px-5 font-semibold text-slate-100">
                        {item.category}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider shadow-sm">
                            {item.maskedValue}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(item.maskedValue, item.id);
                            }}
                            className="text-slate-400 hover:text-cyan-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                            title="Copy masked token"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-20 bg-slate-800/80 rounded-full h-2 overflow-hidden p-0.5 border border-slate-700/60">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                confidencePct >= 80 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : confidencePct >= 60 ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-amber-400'
                              }`}
                              style={{ width: `${confidencePct}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs font-semibold text-slate-300">{confidencePct}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        {renderSourceBadge(item.source)}
                      </td>
                      <td className="py-4 px-5">
                        <RiskBadge level={item.riskLevel || 'MEDIUM'} size="sm" />
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-xl transition-all"
                        >
                          <span>{isExpanded ? 'Hide' : 'Inspect Snippet'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-slate-950/80 border-y border-slate-800">
                        <td colSpan="7" className="p-5">
                          <div className="space-y-3.5 max-w-4xl">
                            <MaskedSnippet
                              snippet={item.contextSnippet}
                              maskedValue={item.maskedValue}
                              category={item.category}
                            />
                            {item.aiReasoning && (
                              <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-2xl p-3.5 text-xs text-cyan-200 flex items-start gap-3 shadow-md">
                                <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 mt-0.5">
                                  <Bot className="w-4 h-4" />
                                </div>
                                <div className="leading-relaxed">
                                  <span className="font-bold text-cyan-300 block mb-0.5">Gemini 3.8 Flash Semantic Verification</span>
                                  <span>{item.aiReasoning}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
