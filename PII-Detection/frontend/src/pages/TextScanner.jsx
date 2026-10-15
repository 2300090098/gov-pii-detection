import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import SyntheticTemplates from '../components/SyntheticTemplates.jsx';
import { api } from '../services/api.js';

export default function TextScanner() {
  const [inputText, setInputText] = useState('');
  const [documentTitle, setDocumentTitle] = useState('Pasted Workload Scan');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  const handleSelectTemplate = (template) => {
    setInputText(template.text);
    setDocumentTitle(template.name);
    setError('');
  };

  const handleClear = () => {
    setInputText('');
    setDocumentTitle('Pasted Workload Scan');
    setError('');
  };

  const handleScan = async () => {
    if (!inputText.trim()) {
      setError('Please enter or paste text to perform PII detection.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.scanText(inputText, documentTitle);

      if (response.success && response.scan) {
        navigate(`/results/${response.scan.id}`, { state: { scan: response.scan } });
      } else {
        throw new Error(response.error || 'Scan processing failed.');
      }
    } catch (err) {
      setError(err.message || 'Error executing text scan. Check backend server.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-100">Direct Text PII Inspector</h2>
          <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
            REAL-TIME
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Paste unstructured text or load synthetic dummy templates to evaluate regex patterns, context proximity heuristics, and Gemini 3.8 Flash semantic reasoning.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Synthetic Presets Selector */}
      <SyntheticTemplates onSelectTemplate={handleSelectTemplate} />

      {/* Main Text Input Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
            Audit Document Title / Identifier
          </label>
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors font-medium"
            placeholder="e.g. Employee Verification Notes or Vendor Contract Snippet"
          />
        </div>

        {/* Text Area */}
        <div className="relative">
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
            Input Payload (Raw Text)
          </label>
          <textarea
            rows={12}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text containing potential government PII (Aadhaar, PAN, Passport, DL, Voter ID, UAN, phone, email) or select a synthetic preset above..."
            className="w-full bg-slate-950/90 border border-slate-700 focus:border-cyan-500 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none transition-colors resize-y leading-relaxed"
          />

          {/* Character & Word Counter */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2 px-1">
            <span>
              Characters: <strong className="text-cyan-400">{charCount.toLocaleString()}</strong> | Words: <strong className="text-slate-300">{wordCount.toLocaleString()}</strong>
            </span>
            <span className="text-slate-500">Max limit: 500,000 characters</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleClear}
            disabled={!inputText || isLoading}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-850 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Input</span>
          </button>

          <button
            type="button"
            onClick={handleScan}
            disabled={!inputText.trim() || isLoading}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              inputText.trim() && !isLoading
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isLoading ? 'Scanning Text Pipeline...' : 'Inspect Text for Government PII'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
