import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  Bot, 
  Trash2, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  Server,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api.js';

export default function Settings() {
  const [settings, setSettings] = useState({
    categories: {
      aadhaar: true,
      pan: true,
      passport: true,
      driving_license: true,
      voter_id: true,
      gov_id: true,
      phone: true,
      email: true,
    },
    confidenceThreshold: 0.55,
    autoDeleteFiles: true,
    useGemini: true,
    theme: 'dark'
  });

  const [systemStatus, setSystemStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    api.getSettings()
      .then((res) => {
        if (res.success) {
          if (res.settings) setSettings(res.settings);
          if (res.systemStatus) setSystemStatus(res.systemStatus);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCategoryToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [key]: !prev.categories[key]
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      const res = await api.updateSettings(settings);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to save configuration settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const categoryLabels = [
    { key: 'aadhaar', label: 'Aadhaar-like Identifiers', desc: '12-digit Indian UID with Verhoeff algorithmic check' },
    { key: 'pan', label: 'PAN-like Identifiers', desc: '10-character Permanent Account Number format' },
    { key: 'passport', label: 'Passport-like Identifiers', desc: 'Indian passport format (Letter + 7 digits)' },
    { key: 'driving_license', label: 'Driving Licence-like', desc: 'State code, RTO, and registration sequence' },
    { key: 'voter_id', label: 'Voter ID (EPIC)-like', desc: 'Election Commission 3-letter + 7-digit identifier' },
    { key: 'gov_id', label: 'Gov Beneficiary / Social Security', desc: 'ABHA ID (14 digits), EPFO / UAN (12 digits), PPO' },
    { key: 'phone', label: 'Phone Numbers', desc: 'Indian mobile numbers (+91 / 0) and landline patterns' },
    { key: 'email', label: 'Email Addresses', desc: 'Standard RFC-compliant personal email identifiers' },
  ];

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
        <p className="text-xs font-mono text-slate-400">Loading system configuration and rules...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-100">Inspection Rules & Governance Settings</h2>
          <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
            ADMIN READY
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Customize active detection rules, confidence thresholds, AI semantic filters, and automated file retention policies.
        </p>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-4 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Configuration settings updated and applied to detection pipeline successfully!</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Detection Categories Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-200">Active PII Categories</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Modular Rules</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {categoryLabels.map(({ key, label, desc }) => (
              <label
                key={key}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
              >
                <input
                  type="checkbox"
                  checked={settings.categories?.[key] ?? true}
                  onChange={() => handleCategoryToggle(key)}
                  className="mt-0.5 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">{label}</span>
                  <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">{desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Confidence Threshold & AI Settings */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-200">Sensitivity & AI Verification</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Confidence Calibration</span>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Confidence Score Threshold</span>
              <span className="font-mono text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                {Math.round((settings.confidenceThreshold || 0.55) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.40"
              max="0.95"
              step="0.05"
              value={settings.confidenceThreshold || 0.55}
              onChange={(e) => setSettings({ ...settings, confidenceThreshold: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>More Detections (40%)</span>
              <span>Balanced (55%)</span>
              <span>Strict / High Confidence (95%)</span>
            </div>
          </div>

          {/* Gemini AI Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Gemini 3.8 Flash Semantic Verification
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Sends privacy-sanitized candidate excerpts for AI disambiguation to filter false positives.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.useGemini ?? true}
              onChange={(e) => setSettings({ ...settings, useGemini: e.target.checked })}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
            />
          </div>

          {/* Auto Delete Temporary Files */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Immediate Temporary File Shredding
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Automatically unlink and purge uploaded documents from disk as soon as text is extracted.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoDeleteFiles ?? true}
              onChange={(e) => setSettings({ ...settings, autoDeleteFiles: e.target.checked })}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* System Telemetry & Admin View */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-200">System Integration & Connectivity</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Diagnostics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px]">DATABASE ENGINE</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <span className={`w-2 h-2 rounded-full ${systemStatus?.firebaseConnected ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
                <span>{systemStatus?.firebaseConnected ? 'Firebase Firestore' : 'Persistent Storage'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px]">AI MODEL SPECIFICATION</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <span className={`w-2 h-2 rounded-full ${systemStatus?.geminiConfigured ? 'bg-cyan-400' : 'bg-amber-400'}`} />
                <span>{systemStatus?.geminiConfigured ? 'gemini-3.8-flash' : 'Rule Heuristics'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px]">DATA PRIVACY STANDARD</span>
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Raw PII Storage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Applying Settings...' : 'Save Configuration Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
